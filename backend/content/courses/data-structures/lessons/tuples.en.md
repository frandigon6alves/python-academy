# Tuples

A **tuple** is an ordered collection, like a list, but it is **immutable**: once created, its items cannot be added, removed or replaced. Tuples are written with parentheses.

```python
point = (3, 4)
rgb = (255, 128, 0)
print(point[0], rgb[-1], len(rgb))
print(rgb[:2])
```

```text
3 0 3
(255, 128)
```

Indexing, slicing, `len()`, `in`, and looping all work just like with lists.

## Creating tuples

It is actually the **comma** that makes a tuple, not the parentheses. This matters for single-item tuples:

```python
a = 5
b = (5,)
c = 1, 2, 3
print(type(a).__name__, type(b).__name__, c)
print(tuple("abc"))
```

```text
int tuple (1, 2, 3)
('a', 'b', 'c')
```

`(5)` is just the number 5 in parentheses. To make a one-item tuple you need a trailing comma: `(5,)`. The built-in `tuple()` converts any iterable into a tuple.

## Immutability

You cannot change a tuple's items:

```python
point = (3, 4)
try:
    point[0] = 10
except TypeError as error:
    print("Error:", error)
```

```text
Error: 'tuple' object does not support item assignment
```

Because of this, tuples only have two methods, `count()` and `index()`. If you need a modified version, build a new tuple:

```python
point = (3, 4)
moved = (point[0] + 1, point[1])
print(moved)
```

```text
(4, 4)
```

One subtle detail: a tuple holds references to objects. If one of those objects is mutable, such as a list, that inner object can still change, even though the tuple itself cannot be reassigned.

## Unpacking

**Unpacking** assigns the items of a tuple (or any iterable) to several names at once. You have already used it for swapping variables and for functions that return several values.

```python
person = ("Lucia", 34, "Madrid")
name, age, city = person
print(f"{name} is {age} and lives in {city}")
```

```text
Lucia is 34 and lives in Madrid
```

The number of names must match the number of items. A starred name collects "the rest" into a list:

```python
first, *middle, last = (1, 2, 3, 4, 5)
print(first, middle, last)
```

```text
1 [2, 3, 4] 5
```

Unpacking is especially handy in loops:

```python
pairs = [("x", 1), ("y", 2)]
for letter, number in pairs:
    print(letter * number)
```

```text
x
yy
```

## When to use a tuple

Choose a tuple when the data has a **fixed structure** and should not change, such as coordinates, an RGB colour, or a database row. Choose a list when you have a **variable number** of similar items that may grow or change.

Tuples have practical advantages too. Because they are immutable, tuples made of immutable values are **hashable**, so they can be used as dictionary keys or stored in sets, which lists cannot:

```python
distances = {("Paris", "Rome"): 1105, ("Lima", "Quito"): 1320}
print(distances[("Paris", "Rome")])
```

```text
1105
```

Immutability also signals intent: whoever reads your code knows that the values are not supposed to change.

## Key takeaways

- Tuples are ordered and immutable; they support indexing, slicing and looping.
- The comma creates a tuple, so a one-item tuple needs a trailing comma: `(5,)`.
- Unpacking assigns items to several names, and `*rest` collects leftovers.
- Use tuples for fixed records and as dictionary keys; use lists for changing collections.
