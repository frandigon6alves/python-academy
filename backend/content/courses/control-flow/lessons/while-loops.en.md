# While Loops

A `while` loop keeps repeating its body **as long as a condition is true**. Use it when you do not know in advance how many repetitions you need.

## The basic shape

```python
countdown = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Lift off!")
```

```text
3
2
1
Lift off!
```

Before every pass, Python checks the condition. If it is true, the body runs; if it is false, the loop ends and the program continues after it. If the condition is false from the start, the body never runs at all.

## Avoiding infinite loops

The body of a `while` loop must eventually make the condition false. Forget to update `countdown` in the example above and the loop would print `3` forever. If that ever happens while experimenting, press **Ctrl+C** in the terminal to stop the program.

A good habit is to ask three questions about every `while` loop:

1. What variable controls the condition?
2. Where is it changed inside the loop?
3. Does that change move it toward making the condition false?

```python
balance = 100
years = 0
while balance < 200:
    balance *= 1.10
    years += 1
print(f"Doubled after {years} years: {balance:.2f}")
```

```text
Doubled after 8 years: 214.36
```

Here `balance` grows every pass, so the loop is guaranteed to end.

## Leaving early with break

`break` exits the loop immediately, skipping the rest of the body and any remaining passes.

```python
numbers = [7, 12, 5, 30, 8]
for n in numbers:
    if n > 20:
        print("Found a big one:", n)
        break
    print("Checked", n)
```

```text
Checked 7
Checked 12
Checked 5
Found a big one: 30
```

`break` works in both `for` and `while` loops. A popular pattern is `while True:` combined with `break`, which reads as "keep going until I say stop". It is common for menus or for asking the user until they give a valid answer:

```python
while True:
    answer = input("Type yes or no: ").lower()
    if answer in ("yes", "no"):
        break
    print("Please answer yes or no.")
print("You said", answer)
```

## Skipping ahead with continue

`continue` skips the rest of the current pass and jumps straight to the next one.

```python
for n in range(1, 8):
    if n % 2 == 0:
        continue
    print(n, end=" ")
print()
```

```text
1 3 5 7 
```

Even numbers hit `continue`, so only odd numbers reach the `print()`.

Be careful with `continue` inside a `while` loop: if the line that updates your counter comes after the `continue`, it will be skipped and the loop may never end.

```python
i = 0
while i < 5:
    i += 1
    if i == 3:
        continue
    print(i, end=" ")
print()
```

```text
1 2 4 5 
```

Updating `i` at the top of the body keeps this loop safe.

## for or while?

Use `for` when you are walking through a collection or a known range of numbers. Use `while` when the loop depends on something that changes in a way you cannot predict, such as user input or a value reaching a target.

## Key takeaways

- A `while` loop runs while its condition is true and may run zero times.
- Make sure the body moves the condition toward false, or the loop never ends.
- `break` exits a loop immediately; `continue` skips to the next pass.
- `while True:` with `break` is a clean pattern for repeating until a goal is met.
