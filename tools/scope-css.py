"""Prefix every selector in a flat CSS file with a :root[data-style=X] scope."""
import re, sys

def split_rules(css):
    i, n, out = 0, len(css), []
    while i < n:
        if css.startswith('/*', i):
            j = css.index('*/', i) + 2; out.append(('comment', css[i:j])); i = j; continue
        if css[i].isspace():
            j = i
            while j < n and css[j].isspace(): j += 1
            out.append(('ws', css[i:j])); i = j; continue
        j = css.index('{', i)
        head = css[i:j]
        depth, k = 1, j + 1
        while depth:
            if css.startswith('/*', k): k = css.index('*/', k) + 2; continue
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        out.append(('rule', head, css[j + 1:k - 1])); i = k
    return out

def prefix_sel(sel, scope):
    sel = sel.strip()
    if sel.startswith(':root'):
        return ':root' + scope + sel[5:]
    if sel.startswith('html'):
        return 'html' + scope + sel[4:]
    return ':root' + scope + ' ' + sel

def split_selectors(head):
    parts, depth, cur = [], 0, ''
    for ch in head:
        if ch in '([': depth += 1
        if ch in ')]': depth -= 1
        if ch == ',' and depth == 0: parts.append(cur); cur = ''
        else: cur += ch
    parts.append(cur)
    return parts

def scope_css(css, scope):
    out = []
    for item in split_rules(css):
        if item[0] != 'rule': out.append(item[1]); continue
        head, body = item[1].strip(), item[2]
        if head.startswith('@media') or head.startswith('@supports'):
            out.append(f'{head} {{{scope_css(body, scope)}}}')
        elif head.startswith('@'):
            out.append(f'{head} {{{body}}}')
        else:
            sels = ',\n'.join(prefix_sel(s, scope) for s in split_selectors(head))
            out.append(f'{sels} {{{body}}}')
    return ''.join(out)

if __name__ == '__main__':
    src, scope = sys.argv[1], sys.argv[2]
    sys.stdout.write(scope_css(open(src).read(), scope))
