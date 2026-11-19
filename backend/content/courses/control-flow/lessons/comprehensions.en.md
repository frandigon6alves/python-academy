# Comprehensions

A **comprehension** builds a new collection from an existing iterable in a single, readable expression. It replaces the common "create an empty list, loop, append" pattern.

## List comprehensions

Here is the long way to square some numbers:

```python
squares = []
for n in range(1, 6):
    squares.append(n * n)
print(squares)
```

```text
[1, 4, 9, 16, 25]
```

And here is the same thing as a list comprehension:

```python
squares = [n * n for n in range(1, 6)]
print(squares)
```

```text
[1, 4, 9, 16, 25]
```

Read it from the middle: "for each `n` in `range(1, 6)`, put `n * n` in the new list". The general shape is `[expression for item in iterable]`.

The expression can be anything, including method calls:

```python
words = ["python", "is", "fun"]
print([w.upper() for w in words])
print([len(w) for w in words])
```

```text
['PYTHON', 'IS', 'FUN']
[6, 2, 3]
```

## Filtering with a condition

Add `if` at the end to keep only some items.

```python
numbers = [3, 8, 12, 5, 6, 1]
evens = [n for n in numbers if n % 2 == 0]
print(evens)
```

```text
[8, 12, 6]
```

If you want to **transform** every item differently depending on a condition, put a conditional expression at the front instead. Note the different position:

```python
numbers = [3, 8, 12, 5]
labels = ["even" if n % 2 == 0 else "odd" for n in numbers]
print(labels)
```

```text
['odd', 'even', 'even', 'odd']
```

A trailing `if` filters (fewer items come out); a leading `if ... else` chooses a value (the same number of items comes out).

## Dictionary comprehensions

Use curly braces and a `key: value` pair to build a dictionary.

```python
names = ["ana", "bruno", "carla"]
lengths = {name: len(name) for name in names}
print(lengths)

prices = {"tea": 2.0, "cake": 4.5, "juice": 3.0}
cheap = {item: p for item, p in prices.items() if p < 4}
print(cheap)
```

```text
{'ana': 3, 'bruno': 5, 'carla': 5}
{'tea': 2.0, 'juice': 3.0}
```

## Set comprehensions

Curly braces with a single expression build a set, which automatically removes duplicates.

```python
words = ["Apple", "avocado", "Banana", "blueberry", "cherry"]
initials = {w[0].lower() for w in words}
print(sorted(initials))
```

```text
['a', 'b', 'c']
```

We printed `sorted(initials)` because sets have no guaranteed order.

## Multiple for clauses

A comprehension can contain more than one `for`. They run in the same order as nested loops would.

```python
pairs = [(x, y) for x in range(1, 3) for y in "ab"]
print(pairs)
```

```text
[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]
```

## When not to use them

Comprehensions are great for short transformations. If you need several conditions, nested loops and complex expressions all at once, a regular `for` loop is easier to read and debug. Also avoid comprehensions used only for side effects, such as printing; a plain loop says that more honestly.

## Key takeaways

- `[expr for item in iterable]` builds a list in one expression.
- A trailing `if` filters items; a leading `x if cond else y` chooses a value per item.
- `{k: v for ...}` builds a dictionary and `{expr for ...}` builds a set.
- Prefer a regular loop when the logic gets complicated.
