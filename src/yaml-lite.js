/* ==========================================================================
   yaml-lite.js — a tiny, dependency-free YAML parser.
   --------------------------------------------------------------------------
   Supports the subset used by itinerary.md:
     - nested mappings (2-space indentation)
     - block sequences (- item), including sequences of mappings
     - scalars: strings (quoted/unquoted), numbers, booleans, null
     - inline flow arrays: [a, b, c]  and  [[-36.8, 174.7], ...]
     - folded block scalars:  key: >   (joins wrapped lines with spaces)
     - comment lines (# ...) and blank lines are ignored
   This is NOT a full YAML implementation — just enough for this project,
   so the build has zero external dependencies.
   ========================================================================== */

'use strict';

function parseYaml(input) {
  // Normalize line endings and strip a leading BOM if present.
  var raw = String(input).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  var lines = raw.split('\n');

  // Pre-process into tokens with indentation, skipping comments/blanks.
  // Folded blocks (>) are handled inline during parsing.
  var tokens = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // Strip trailing whitespace but keep leading (indentation matters).
    var noTrail = line.replace(/\s+$/, '');
    if (noTrail === '') continue;
    var trimmed = noTrail.replace(/^\s+/, '');
    if (trimmed.charAt(0) === '#') continue;
    var indent = noTrail.length - trimmed.length;
    tokens.push({ indent: indent, text: trimmed, rawIndex: i });
  }

  var pos = 0;

  function peek() { return tokens[pos]; }

  // Parse a block (mapping or sequence) at a given minimum indent.
  function parseBlock(minIndent) {
    var t = peek();
    if (!t || t.indent < minIndent) return null;
    if (t.text.charAt(0) === '-') return parseSequence(t.indent);
    return parseMapping(t.indent);
  }

  function parseSequence(indent) {
    var arr = [];
    while (true) {
      var t = peek();
      if (!t || t.indent !== indent || t.text.charAt(0) !== '-') break;
      pos++;
      var rest = t.text.slice(1).replace(/^\s+/, ''); // after the dash
      if (rest === '') {
        // Nested block starts on following lines.
        var child = parseBlock(indent + 1);
        arr.push(child == null ? null : child);
      } else if (isKeyValue(rest)) {
        // "- key: value" -> a mapping whose first key is on the dash line.
        // Build a synthetic mapping: treat the dash-line key plus any deeper
        // lines (indent > the key's column) as one mapping.
        var keyIndent = indent + (t.text.length - rest.length); // column of key
        var map = {};
        applyKeyValue(map, rest, keyIndent);
        // Absorb following lines that are more indented than the dash.
        while (true) {
          var n = peek();
          if (!n || n.indent <= indent) break;
          if (n.text.charAt(0) === '-') {
            // A sequence nested under this mapping is handled via its key,
            // so a bare dash here would be malformed; stop to be safe.
            break;
          }
          pos++;
          applyKeyValue(map, n.text, n.indent);
        }
        arr.push(map);
      } else {
        arr.push(parseScalar(rest));
      }
    }
    return arr;
  }

  function parseMapping(indent) {
    var map = {};
    while (true) {
      var t = peek();
      if (!t || t.indent !== indent || t.text.charAt(0) === '-') break;
      pos++;
      applyKeyValue(map, t.text, indent);
    }
    return map;
  }

  // Apply a "key: value" line to a map, recursing for nested blocks and
  // handling folded (>) scalars.
  function applyKeyValue(map, text, keyIndent) {
    var idx = findColon(text);
    if (idx === -1) return; // not a key/value; ignore
    var key = text.slice(0, idx).trim();
    var valuePart = text.slice(idx + 1).replace(/^\s+/, '');

    if (valuePart === '' ) {
      // Value is a nested block on following, more-indented lines.
      var child = parseBlock(keyIndent + 1);
      map[key] = child == null ? null : child;
    } else if (valuePart === '>' || valuePart === '>-' || valuePart === '|' || valuePart === '|-') {
      map[key] = parseFolded(keyIndent, valuePart.charAt(0) === '|');
    } else {
      map[key] = parseScalar(valuePart);
    }
  }

  // Folded (>) joins lines with spaces; literal (|) keeps newlines.
  function parseFolded(parentIndent, literal) {
    var parts = [];
    var blockIndent = null;
    while (true) {
      var t = peek();
      if (!t || t.indent <= parentIndent) break;
      if (blockIndent == null) blockIndent = t.indent;
      pos++;
      parts.push(t.text);
    }
    return literal ? parts.join('\n') : parts.join(' ');
  }

  function isKeyValue(text) {
    return findColon(text) !== -1;
  }

  // Find the colon that separates key from value, ignoring colons inside
  // quotes or inline flow arrays/objects.
  function findColon(text) {
    var inSingle = false, inDouble = false, depth = 0;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (c === "'" && !inDouble) inSingle = !inSingle;
      else if (c === '"' && !inSingle) inDouble = !inDouble;
      else if (!inSingle && !inDouble) {
        if (c === '[' || c === '{') depth++;
        else if (c === ']' || c === '}') depth--;
        else if (c === ':' && depth === 0) {
          // must be followed by space or end-of-line to count as separator
          if (i + 1 >= text.length || text[i + 1] === ' ') return i;
        }
      }
    }
    return -1;
  }

  function parseScalar(str) {
    var s = str.trim();
    // Strip trailing inline comment (only when not in quotes/brackets).
    s = stripInlineComment(s);

    if (s === '') return null;
    if (s === '~' || s === 'null' || s === 'Null' || s === 'NULL') return null;
    if (s === 'true' || s === 'True' || s === 'TRUE') return true;
    if (s === 'false' || s === 'False' || s === 'FALSE') return false;

    // Quoted string
    if ((s.charAt(0) === '"' && s.charAt(s.length - 1) === '"') ||
        (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'")) {
      var inner = s.slice(1, -1);
      if (s.charAt(0) === '"') inner = inner.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      else inner = inner.replace(/''/g, "'");
      return inner;
    }

    // Inline flow array
    if (s.charAt(0) === '[' && s.charAt(s.length - 1) === ']') {
      return parseFlowArray(s);
    }
    // Inline flow map
    if (s.charAt(0) === '{' && s.charAt(s.length - 1) === '}') {
      return parseFlowMap(s);
    }

    // Number
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);

    return s;
  }

  function stripInlineComment(s) {
    var inSingle = false, inDouble = false, depth = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === "'" && !inDouble) inSingle = !inSingle;
      else if (c === '"' && !inSingle) inDouble = !inDouble;
      else if (!inSingle && !inDouble) {
        if (c === '[' || c === '{') depth++;
        else if (c === ']' || c === '}') depth--;
        else if (c === '#' && depth === 0 && (i === 0 || s[i - 1] === ' ')) {
          return s.slice(0, i).replace(/\s+$/, '');
        }
      }
    }
    return s;
  }

  // Split top-level items of a flow collection body by commas, respecting
  // nested brackets and quotes.
  function splitFlow(body) {
    var items = [];
    var cur = '';
    var inSingle = false, inDouble = false, depth = 0;
    for (var i = 0; i < body.length; i++) {
      var c = body[i];
      if (c === "'" && !inDouble) { inSingle = !inSingle; cur += c; }
      else if (c === '"' && !inSingle) { inDouble = !inDouble; cur += c; }
      else if (!inSingle && !inDouble && (c === '[' || c === '{')) { depth++; cur += c; }
      else if (!inSingle && !inDouble && (c === ']' || c === '}')) { depth--; cur += c; }
      else if (!inSingle && !inDouble && c === ',' && depth === 0) { items.push(cur); cur = ''; }
      else cur += c;
    }
    if (cur.trim() !== '') items.push(cur);
    return items;
  }

  function parseFlowArray(s) {
    var body = s.slice(1, -1).trim();
    if (body === '') return [];
    return splitFlow(body).map(function (item) { return parseScalar(item.trim()); });
  }

  function parseFlowMap(s) {
    var body = s.slice(1, -1).trim();
    var out = {};
    if (body === '') return out;
    splitFlow(body).forEach(function (pair) {
      var ci = findColon(pair);
      if (ci === -1) return;
      var k = pair.slice(0, ci).trim().replace(/^["']|["']$/g, '');
      out[k] = parseScalar(pair.slice(ci + 1).trim());
    });
    return out;
  }

  var result = parseBlock(0);
  return result == null ? {} : result;
}

module.exports = { parseYaml: parseYaml };
