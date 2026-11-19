# Bucles for

Un bucle `for` repite un bloque de código una vez por cada elemento de una secuencia. Es la forma más habitual de procesar colecciones en Python.

## Recorrer una secuencia

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

En cada vuelta, la **variable del bucle** `fruit` se refiere al siguiente elemento. Tú eliges su nombre; usar el singular del nombre de la colección se lee muy bien. Las cadenas también son secuencias, así que puedes recorrer sus caracteres:

```python
for letter in "hey":
    print(letter.upper())
```

```text
H
E
Y
```

Cualquier cosa que se pueda recorrer se llama **iterable**: listas, cadenas, tuplas, diccionarios, conjuntos, archivos y más.

## Contar con range()

Cuando necesitas repetir algo un número fijo de veces, o necesitas números, usa `range()`.

```python
for i in range(3):
    print("Round", i)
```

```text
Round 0
Round 1
Round 2
```

`range(stop)` cuenta desde 0 hasta `stop`, **sin incluirlo**. También puedes indicar un inicio y un paso:

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

Aquí envolvemos `range()` en `list()` solo para mostrar sus valores. En un bucle se usa directamente; genera los números a medida que se necesitan, sin construir una lista en memoria.

## Acumular resultados

Un patrón común es empezar con un valor vacío o cero y actualizarlo dentro del bucle.

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

Para una suma simple, la función integrada `sum(prices)` hace lo mismo, pero el patrón anterior sirve para cualquier tipo de acumulación.

## Obtener el índice con enumerate()

A veces necesitas tanto la posición como el elemento. Al empezar se suele escribir `for i in range(len(items))`, pero `enumerate()` es más limpio:

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

`enumerate()` produce parejas (índice, elemento). El argumento opcional `start` cambia el primer número, algo útil para numerar de forma amigable.

## Recorrer dos secuencias con zip()

Para recorrer dos listas en paralelo, usa `zip()`:

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

`zip()` se detiene en la secuencia más corta, así que los elementos sobrantes de una lista más larga se ignoran.

## Bucles anidados

Un bucle puede contener otro bucle. El bucle interior se ejecuta completo en cada vuelta del exterior.

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

## Puntos clave

- `for item in iterable:` ejecuta el cuerpo una vez por elemento.
- `range(start, stop, step)` genera números y nunca incluye `stop`.
- Acumula resultados actualizando una variable dentro del bucle.
- Usa `enumerate()` para obtener índice y elemento a la vez, y `zip()` para emparejar secuencias.
