# Entrada y salida

Los programas se vuelven interesantes cuando hablan con quien los usa. En Python, `print()` envía texto hacia fuera e `input()` recibe texto.

## print() en detalle

`print()` acepta cualquier número de valores separados por comas. Por defecto pone un espacio entre ellos y un salto de línea al final.

```python
print("Total:", 3, True)
```

```text
Total: 3 True
```

Dos argumentos con nombre permiten cambiar ese comportamiento. `sep` controla lo que va entre los valores y `end` controla lo que va al final.

```python
print("2024", "05", "17", sep="-")
print("Loading", end="...")
print("done")
print("a", "b", "c", sep="")
```

```text
2024-05-17
Loading...done
abc
```

Como la segunda llamada terminó con `"..."` en lugar de un salto de línea, el siguiente `print()` continuó en la misma línea.

## input() siempre devuelve una cadena

`input()` muestra un mensaje, espera a que la persona escriba algo y pulse Enter, y devuelve lo que escribió **como cadena**.

```python
name = input("What is your name? ")
print("Nice to meet you,", name)
```

Esto es una fuente clásica de errores. Aunque la persona escriba `21`, obtienes el texto `"21"`, no el número 21. Para hacer cálculos tienes que convertirlo primero:

```python
age_text = input("How old are you? ")
age = int(age_text)
print("Next year you will be", age + 1)
```

Si la persona escribe algo que no es un número, `int()` lanza un `ValueError`. Más adelante aprenderás a manejarlo con elegancia.

## f-strings

Construir mensajes con `+` y `str()` se vuelve engorroso enseguida. Los **f-strings** son la forma moderna y legible de mezclar texto y valores. Pon una `f` antes de la comilla de apertura y escribe expresiones entre llaves.

```python
name = "Lina"
items = 3
price = 4.5
print(f"{name} bought {items} items for {items * price} euros.")
```

```text
Lina bought 3 items for 13.5 euros.
```

Dentro de las llaves puede ir cualquier expresión válida, incluidas llamadas a métodos como `{name.upper()}`.

## Especificaciones de formato

Después de la expresión puedes añadir dos puntos y una **especificación de formato** para controlar cómo se muestra el valor.

```python
pi = 3.14159265
big = 1234567
ratio = 0.256
print(f"{pi:.2f}")
print(f"{big:,}")
print(f"{ratio:.1%}")
print(f"[{'left':<8}]")
print(f"[{'right':>8}]")
print(f"[{'mid':^9}]")
print(f"{7:03d}")
```

```text
3.14
1,234,567
25.6%
[left    ]
[   right]
[   mid   ]
007
```

Esto es lo que significa cada especificación:

- `.2f` muestra un float con dos decimales.
- `,` añade separadores de miles.
- `.1%` multiplica por 100 y añade el signo de porcentaje.
- `<8`, `>8` y `^9` alinean el texto a la izquierda, a la derecha o al centro dentro de ese ancho.
- `03d` rellena un entero con ceros hasta tres dígitos.

Un truco útil para depurar: escribir `=` después de una expresión muestra tanto la expresión como su valor.

```python
x = 10
print(f"{x * 2 = }")
```

```text
x * 2 = 20
```

## Puntos clave

- `print()` separa los valores con `sep` (por defecto, un espacio) y termina con `end` (por defecto, un salto de línea).
- `input()` siempre devuelve una cadena, así que conviértela con `int()` o `float()` antes de hacer cálculos.
- Los f-strings insertan expresiones dentro de `{}` para crear mensajes legibles.
- Especificaciones de formato como `:.2f`, `:,`, `:>8` y `:.1%` controlan el aspecto de los valores.
