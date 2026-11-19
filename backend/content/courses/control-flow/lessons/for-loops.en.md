# For Loops

A `for` loop repeats a block of code once for each item in a sequence. It is the most common way to process collections in Python.

## Iterating over a sequence

```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like", fruit)
```

```text
I like apple
I like banana
I like cherry
```

On each pass, the **loop variable** `fruit` refers to the next item. You choose its name; a singular form of the collection's name reads nicely. Strings are sequences too, so you can loop over their characters:

```python
for letter in "hey":
    print(letter.upper())
```

```text
H
E
Y
```

Anything you can loop over is called an **iterable**: lists, strings, tuples, dictionaries, sets, files and more.

## Counting with range()

When you need to repeat something a fixed number of times, or need numbers, use `range()`.

```python
for i in range(3):
    print("Round", i)
```

```text
Round 0
Round 1
Round 2
```

`range(stop)` counts from 0 up to, but **not including**, `stop`. You can also give a start and a step:

```python
print(list(range(2, 6)))
print(list(range(0, 10, 3)))
print(list(range(5, 0, -1)))
```

```text
[2, 3, 4, 5]
[0, 3, 6, 9]
[5, 4, 3, 2, 1]
```

Wrapping `range()` in `list()` here is only to display its values. In a loop you use it directly; it produces numbers on demand without building a list in memory.

## Accumulating results

A common pattern is to start with an empty or zero value and update it inside the loop.

```python
prices = [4.5, 10.0, 2.25]
total = 0
for price in prices:
    total += price
print(f"Total: {total:.2f}")
```

```text
Total: 16.75
```

For a simple sum, the built-in `sum(prices)` does the same job, but the pattern above works for any kind of accumulation.

## Getting the index with enumerate()

Sometimes you need both the position and the item. Beginners often write `for i in range(len(items))`, but `enumerate()` is cleaner:

```python
podium = ["Mia", "Leo", "Zoe"]
for position, name in enumerate(podium, start=1):
    print(f"{position}. {name}")
```

```text
1. Mia
2. Leo
3. Zoe
```

`enumerate()` produces pairs of (index, item). The optional `start` argument changes the first number, which is handy for human-friendly numbering.

## Looping over two sequences with zip()

To walk through two lists side by side, use `zip()`:

```python
names = ["Ana", "Ben"]
scores = [91, 78]
for name, score in zip(names, scores):
    print(name, score)
```

```text
Ana 91
Ben 78
```

`zip()` stops at the shortest sequence, so extra items in a longer list are ignored.

## Nested loops

A loop can contain another loop. The inner loop runs completely for every pass of the outer one.

```python
for row in range(1, 4):
    line = ""
    for col in range(1, 4):
        line += f"{row * col:4}"
    print(line)
```

```text
   1   2   3
   2   4   6
   3   6   9
```

## Key takeaways

- `for item in iterable:` runs the body once per item.
- `range(start, stop, step)` generates numbers and never includes `stop`.
- Accumulate results by updating a variable inside the loop.
- Use `enumerate()` for index and item together, and `zip()` to pair sequences.
