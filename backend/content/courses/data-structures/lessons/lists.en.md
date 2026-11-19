# Lists

A **list** is an ordered collection of items written inside square brackets. Lists can hold any type of value, can mix types, and can grow or shrink while your program runs.

```python
colors = ["red", "green", "blue"]
mixed = [1, "two", 3.0, True]
empty = []
print(len(colors), colors[0], colors[-1])
print(colors[1:])
```

```text
3 red blue
['green', 'blue']
```

Indexing and slicing work exactly as they do with strings.

## Lists are mutable

Unlike strings, lists are **mutable**: you can change them in place.

```python
colors = ["red", "green", "blue"]
colors[1] = "yellow"
print(colors)
```

```text
['red', 'yellow', 'blue']
```

## Common methods

```python
tasks = ["wash", "cook"]
tasks.append("read")
tasks.insert(0, "wake up")
tasks.extend(["code", "sleep"])
print(tasks)

tasks.remove("cook")
last = tasks.pop()
first = tasks.pop(0)
print(tasks, last, first)

print(tasks.index("read"), tasks.count("wash"), "code" in tasks)
```

```text
['wake up', 'wash', 'cook', 'read', 'code', 'sleep']
['wash', 'read', 'code'] sleep wake up
1 1 True
```

- `append(x)` adds one item to the end; `extend(iterable)` adds many.
- `insert(i, x)` adds an item at a position.
- `remove(x)` deletes the first matching value; `pop()` removes and returns an item, the last one by default.
- `index(x)` finds a position and `count(x)` counts occurrences.

Most of these methods change the list and return `None`. Writing `tasks = tasks.append("x")` is a classic bug that replaces your list with `None`.

## Sorting

There are two ways to sort. The `sort()` method sorts the list in place, while the built-in `sorted()` returns a new sorted list and leaves the original untouched.

```python
scores = [70, 95, 82]
ranking = sorted(scores, reverse=True)
print(ranking, scores)

scores.sort()
print(scores)

words = ["banana", "Kiwi", "apple"]
print(sorted(words))
print(sorted(words, key=str.lower))
print(sorted(words, key=len))
```

```text
[95, 82, 70] [70, 95, 82]
[70, 82, 95]
['Kiwi', 'apple', 'banana']
['apple', 'banana', 'Kiwi']
['Kiwi', 'apple', 'banana']
```

The `key` argument takes a function that is applied to each item to decide the order. Uppercase letters sort before lowercase ones by default, which is why `key=str.lower` is useful for alphabetical order.

## Aliasing and copying

Assigning a list to a new name does **not** copy it. Both names refer to the same list, so a change through one is visible through the other.

```python
original = [1, 2, 3]
alias = original
alias.append(4)
print(original)
print(alias is original)
```

```text
[1, 2, 3, 4]
True
```

To get an independent list, make a copy with `list.copy()`, `list(...)` or the slice `[:]`:

```python
original = [1, 2, 3]
clone = original.copy()
clone.append(99)
print(original, clone)
```

```text
[1, 2, 3] [1, 2, 3, 99]
```

These are **shallow** copies: the outer list is new, but any nested lists inside are still shared. For fully independent nested structures, use `copy.deepcopy()` from the `copy` module.

```python
import copy

grid = [[0, 0], [0, 0]]
shallow = grid.copy()
deep = copy.deepcopy(grid)
grid[0][0] = 7
print(shallow[0][0], deep[0][0])
```

```text
7 0
```

## Key takeaways

- Lists are ordered, mutable collections that support indexing and slicing.
- `append`, `extend`, `insert`, `remove` and `pop` modify the list in place.
- `list.sort()` sorts in place and returns `None`; `sorted()` returns a new list.
- Assignment creates an alias, not a copy; use `.copy()` or `copy.deepcopy()` when you need one.
