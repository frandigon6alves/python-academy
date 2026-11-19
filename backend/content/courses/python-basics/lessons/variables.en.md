# Variables

A variable is a name that points to a value. You create one by writing a name, an equals sign, and the value you want to store. There is no special keyword and no need to declare a type first.

```python
greeting = "Hello"
age = 30
print(greeting)
print(age)
```

```text
Hello
30
```

The `=` sign is called the **assignment operator**. Read it as "make this name refer to this value", not as "is equal to". Python evaluates the right-hand side first, then attaches the name on the left to the result.

## Reassigning a variable

A variable can be pointed at a new value at any time. The old value is simply forgotten by that name.

```python
score = 10
score = score + 5
print(score)
```

```text
15
```

On the second line, Python first computes `score + 5` using the current value (10), and only then makes `score` refer to 15. This pattern is so common that Python has a shortcut for it: `score += 5`. There are similar shortcuts such as `-=`, `*=` and `/=`.

A name can even switch to a value of a completely different kind. Python is **dynamically typed**, which means the type belongs to the value, not to the name.

```python
thing = 42
thing = "now I am text"
print(thing)
```

```text
now I am text
```

This flexibility is handy, but reusing one name for unrelated data quickly makes code confusing. Prefer one clear purpose per name.

## Naming rules

Variable names must follow a few rules:

- They may contain letters, digits and underscores.
- They cannot start with a digit (`2fast` is invalid, `fast2` is fine).
- They are case-sensitive: `total` and `Total` are different variables.
- They cannot be reserved keywords such as `if`, `for`, `class` or `True`.

Beyond the rules, there are conventions. The Python community writes variable names in **snake_case**: lowercase words joined by underscores, like `user_name` or `max_speed`. Choose names that describe the value: `price` tells a reader much more than `p`.

## Multiple assignment

You can assign several variables in one line by separating names and values with commas.

```python
x, y, z = 1, 2, 3
print(x, y, z)
```

```text
1 2 3
```

This also gives you an elegant way to swap two values without a temporary variable:

```python
a = "left"
b = "right"
a, b = b, a
print(a, b)
```

```text
right left
```

You can also give the same value to several names at once with `a = b = 0`.

## Constants by convention

Python has no true constants, but names written in ALL_CAPS signal to other programmers that the value is not meant to change.

```python
MAX_PLAYERS = 4
print("Up to", MAX_PLAYERS, "players")
```

```text
Up to 4 players
```

## Key takeaways

- A variable is a name that refers to a value, created with `=`.
- The right-hand side is evaluated first, then the name is bound to the result.
- Names use snake_case, are case-sensitive and cannot start with a digit or be a keyword.
- Multiple assignment like `a, b = b, a` swaps values in one step.
- ALL_CAPS names are a convention for values that should not change.
