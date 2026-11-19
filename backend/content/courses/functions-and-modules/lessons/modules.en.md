# Modules

As programs grow, keeping everything in one file becomes messy. A **module** is simply a Python file whose functions, classes and variables you can reuse elsewhere. Python also ships with a large **standard library** of ready-made modules.

## Importing a module

Use `import` followed by the module name. You then access its contents with a dot.

```python
import math

print(math.sqrt(81))
print(math.pi)
print(math.ceil(4.2), math.floor(4.8))
```

```text
9.0
3.141592653589793
5 4
```

Keeping the module name as a prefix makes it obvious where each name comes from.

## Importing specific names

`from ... import ...` brings selected names straight into your file, so you can use them without the prefix.

```python
from math import gcd, factorial

print(gcd(24, 36))
print(factorial(5))
```

```text
12
120
```

Avoid `from module import *`. It dumps every name into your file, hides where things come from, and can silently overwrite your own names.

## Aliases

`as` gives a module or name a shorter or clearer alias.

```python
import datetime as dt
from statistics import mean as average

print(average([3, 5, 10]))
print(dt.date(2024, 2, 29).year)
```

```text
6
2024
```

Some aliases are so common they are practically standard in the community, but always choose readability over brevity.

## A tour of three standard modules

The `random` module generates pseudo-random values. Its output changes on every run, so no output is shown here:

```python
import random

print(random.randint(1, 6))
print(random.choice(["rock", "paper", "scissors"]))
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)
print(cards)
```

`randint(a, b)` includes both ends, `choice()` picks one item, and `shuffle()` reorders a list in place.

The `datetime` module works with dates and times. Here we use a fixed date so the output is predictable:

```python
from datetime import date, timedelta

launch = date(2024, 3, 15)
print(launch + timedelta(days=30))
print(launch.strftime("%d/%m/%Y"))
print(launch.weekday())
```

```text
2024-04-14
15/03/2024
4
```

`timedelta` represents a duration, `strftime()` formats a date as text, and `weekday()` returns 0 for Monday up to 6 for Sunday, so 4 means Friday. Use `date.today()` or `datetime.now()` to get the current date or time.

## Writing your own module

Any `.py` file is a module. Imagine a file named `geometry.py`:

```python
def circle_area(radius):
    """Return the area of a circle."""
    return 3.14159 * radius**2
```

Another file in the same folder can then use it with `import geometry` and call `geometry.circle_area(2)`.

## The `if __name__ == "__main__":` guard

When Python runs a file, it sets a special variable `__name__`. If the file is run directly, `__name__` is `"__main__"`. If the file is imported, `__name__` is the module's name instead.

This lets one file act both as a reusable module and as a runnable script:

```python
def circle_area(radius):
    return 3.14159 * radius**2


if __name__ == "__main__":
    print(f"Demo: {circle_area(1):.2f}")
```

```text
Demo: 3.14
```

Running this file directly prints the demo. Importing it from another file gives access to `circle_area` without running the demo code. A group of modules organised in a folder is called a **package**.

## Key takeaways

- `import module` keeps the module prefix; `from module import name` brings in specific names.
- `as` creates an alias, and `from module import *` is best avoided.
- The standard library offers modules such as `math`, `random` and `datetime` out of the box.
- Every `.py` file is a module you can import.
- Code under `if __name__ == "__main__":` runs only when the file is executed directly.
