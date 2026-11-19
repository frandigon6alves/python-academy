# Sets

A **set** is an unordered collection of **unique** items. Sets are perfect for removing duplicates, testing membership quickly, and comparing groups of things.

## Creating sets

Write a set with curly braces, or convert any iterable with `set()`. Duplicates disappear automatically.

```python
tags = {"python", "web", "python", "data"}
print(len(tags))

numbers = set([3, 1, 3, 2, 1])
print(sorted(numbers))

empty = set()
print(type({}).__name__, type(empty).__name__)
```

```text
3
[1, 2, 3]
dict set
```

Note that `{}` creates an empty **dictionary**, not an empty set. Use `set()` for that.

Sets have no order, so they do not support indexing or slicing. When printing a set the items may appear in any order, which is why the examples use `sorted()` to show them predictably. Like dictionary keys, set items must be hashable, so you can store numbers, strings and tuples, but not lists.

## Adding and removing

```python
visited = {"Rome"}
visited.add("Oslo")
visited.add("Rome")
visited.update(["Lima", "Cairo"])
visited.discard("Tokyo")
visited.remove("Cairo")
print(sorted(visited))
```

```text
['Lima', 'Oslo', 'Rome']
```

Adding an item that is already present does nothing. `remove()` raises a `KeyError` if the item is missing, while `discard()` quietly ignores it.

## Fast membership tests

Checking `item in some_set` is extremely fast, even with millions of items, because sets use hashing. For a list, Python has to compare items one by one. When you repeatedly ask "have I seen this before?", a set is the right tool.

```python
seen = set()
for word in ["red", "blue", "red", "green", "blue"]:
    if word in seen:
        print("Repeated:", word)
    seen.add(word)
```

```text
Repeated: red
Repeated: blue
```

A popular idiom for removing duplicates is `list(set(items))`, but remember it loses the original order. To keep order, use `list(dict.fromkeys(items))`.

```python
items = ["b", "a", "b", "c", "a"]
print(list(dict.fromkeys(items)))
```

```text
['b', 'a', 'c']
```

## Set operations

Sets support the operations you may remember from maths, using both operators and methods.

```python
frontend = {"ana", "ben", "carl"}
backend = {"carl", "dina", "ana"}

print(sorted(frontend | backend))
print(sorted(frontend & backend))
print(sorted(frontend - backend))
print(sorted(frontend ^ backend))
```

```text
['ana', 'ben', 'carl', 'dina']
['ana', 'carl']
['ben']
['ben', 'dina']
```

- `|` **union**: items in either set.
- `&` **intersection**: items in both sets.
- `-` **difference**: items in the first set but not the second.
- `^` **symmetric difference**: items in exactly one of the sets.

The method versions are `union()`, `intersection()`, `difference()` and `symmetric_difference()`, and they accept any iterable, not just sets.

You can also compare sets:

```python
required = {"id", "email"}
provided = {"id", "email", "name"}
print(required <= provided)
print(required.isdisjoint({"phone"}))
```

```text
True
True
```

`<=` (or `issubset()`) checks whether every item of one set is in the other, and `isdisjoint()` checks that two sets share no items.

## Key takeaways

- Sets store unique, hashable items with no order and no indexing.
- Use `set()` for an empty set, because `{}` is an empty dictionary.
- Membership tests with `in` are very fast on sets.
- `|`, `&`, `-` and `^` give union, intersection, difference and symmetric difference.
