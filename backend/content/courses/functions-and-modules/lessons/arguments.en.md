# Arguments

Python gives you several flexible ways to pass information into a function. Knowing them lets you design functions that are easy and safe to call.

## Positional and keyword arguments

**Positional arguments** are matched to parameters by their order. **Keyword arguments** are matched by name, so their order does not matter.

```python
def describe(pet, name):
    print(f"My {pet} is called {name}.")


describe("cat", "Luna")
describe(name="Rex", pet="dog")
describe("parrot", name="Kiwi")
```

```text
My cat is called Luna.
My dog is called Rex.
My parrot is called Kiwi.
```

You can mix both styles, but positional arguments must come first. Keyword arguments make calls self-explanatory, especially for booleans: `connect(timeout=5, retry=True)` is far clearer than `connect(5, True)`.

## Default values

A parameter can have a **default value**, used when the caller does not supply one.

```python
def power(base, exponent=2):
    return base**exponent


print(power(5))
print(power(2, 3))
print(power(2, exponent=10))
```

```text
25
8
1024
```

Parameters with defaults must come after those without.

## The mutable default pitfall

Default values are evaluated **once**, when the function is defined, not each time it is called. With immutable values like numbers or strings this never matters. With a mutable value like a list, it causes a surprising bug:

```python
def add_item(item, basket=[]):
    basket.append(item)
    return basket


print(add_item("apple"))
print(add_item("pear"))
```

```text
['apple']
['apple', 'pear']
```

The second call did not get a fresh, empty list. Both calls shared the same list object created at definition time. The standard fix is to use `None` as the default and create the list inside the function:

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket


print(add_item("apple"))
print(add_item("pear"))
```

```text
['apple']
['pear']
```

## Any number of positional arguments: *args

Put `*` before a parameter name to collect any number of extra positional arguments into a tuple. By convention it is called `args`.

```python
def average(*args):
    if not args:
        return 0
    return sum(args) / len(args)


print(average(4, 8, 6))
print(average())
```

```text
6.0
0
```

## Any number of keyword arguments: **kwargs

Two stars collect extra keyword arguments into a dictionary, conventionally called `kwargs`.

```python
def make_profile(name, **kwargs):
    profile = {"name": name}
    profile.update(kwargs)
    return profile


print(make_profile("Ana", city="Lima", age=31))
```

```text
{'name': 'Ana', 'city': 'Lima', 'age': 31}
```

## Unpacking when calling

The stars also work in the other direction. `*` spreads a sequence into positional arguments, and `**` spreads a dictionary into keyword arguments.

```python
def point(x, y, z):
    return f"({x}, {y}, {z})"


coords = [1, 2, 3]
options = {"x": 0, "y": 5, "z": 9}
print(point(*coords))
print(point(**options))
```

```text
(1, 2, 3)
(0, 5, 9)
```

The usual order of parameters in a signature is: regular parameters, `*args`, parameters with defaults that must be given by keyword, and finally `**kwargs`.

## Key takeaways

- Positional arguments match by order; keyword arguments match by name.
- Default values make parameters optional and must come after required ones.
- Never use a mutable object like `[]` as a default; use `None` and create it inside.
- `*args` collects extra positional arguments into a tuple, `**kwargs` collects keyword ones into a dict.
- `*` and `**` also unpack sequences and dictionaries when calling a function.
