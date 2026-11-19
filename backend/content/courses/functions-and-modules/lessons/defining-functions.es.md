# Definir funciones

Una **función** es un bloque de código con nombre y reutilizable. Ya has usado funciones integradas como `print()`, `len()` e `int()`. Ahora toca escribir las tuyas.

## La sentencia def

```python
def greet():
    print("Hello there!")


greet()
greet()
```

```text
Hello there!
Hello there!
```

`def` inicia la definición, seguida del nombre de la función, los paréntesis y dos puntos. Las líneas con sangría que hay debajo forman el **cuerpo**. Definir una función no la ejecuta; el cuerpo solo se ejecuta cuando **llamas** a la función escribiendo su nombre seguido de paréntesis.

Los nombres de funciones siguen la misma convención snake_case que las variables. Los buenos nombres suelen empezar con un verbo: `calculate_total`, `send_email`, `is_valid`.

## Parámetros

Las funciones se vuelven mucho más útiles cuando aceptan datos de entrada. Los nombres dentro de los paréntesis son **parámetros**; los valores que pasas al llamarla son **argumentos**.

```python
def greet(name):
    print(f"Hello, {name}!")


greet("Maya")
greet("Omar")
```

```text
Hello, Maya!
Hello, Omar!
```

## Devolver un valor

`print()` muestra algo en pantalla, pero a menudo quieres que la función entregue un resultado para que el resto del programa pueda usarlo. Eso es lo que hace `return`.

```python
def area(width, height):
    return width * height


room = area(4, 3)
print(room)
print(area(2, 5) + area(1, 1))
```

```text
12
11
```

`return` termina la función inmediatamente y envía el valor a quien la llamó. El código que hay después de un `return` en el mismo bloque nunca se ejecuta. Una función puede tener varias sentencias `return`, por ejemplo una en cada rama de un `if`:

```python
def sign(n):
    if n > 0:
        return "positive"
    if n < 0:
        return "negative"
    return "zero"


print(sign(-3), sign(0), sign(8))
```

```text
negative zero positive
```

Puedes devolver varios valores a la vez separándolos con comas. Python los empaqueta en una tupla, que puedes desempaquetar al recibirla:

```python
def min_max(numbers):
    return min(numbers), max(numbers)


low, high = min_max([4, 9, 1, 7])
print(low, high)
```

```text
1 9
```

## El valor devuelto por defecto: None

Si una función termina sin llegar a un `return`, o usa un `return` vacío, devuelve `None`.

```python
def shout(text):
    print(text.upper())


result = shout("hi")
print(result)
```

```text
HI
None
```

Esta es una confusión clásica: `shout()` **imprime** un valor, pero no lo **devuelve**. Si necesitas usar el resultado después, devuélvelo.

## Docstrings

Un **docstring** es una cadena escrita como primera sentencia del cuerpo de una función. Documenta lo que hace la función, y herramientas como `help()` la muestran.

```python
def celsius_to_fahrenheit(celsius):
    """Convert a temperature from Celsius to Fahrenheit."""
    return celsius * 9 / 5 + 32


print(celsius_to_fahrenheit(100))
print(celsius_to_fahrenheit.__doc__)
```

```text
212.0
Convert a temperature from Celsius to Fahrenheit.
```

Usa comillas triples, escribe una línea de resumen breve en modo imperativo y añade más detalle debajo cuando la función no sea evidente.

## Puntos clave

- `def name(parameters):` define una función; llamarla con `name(arguments)` ejecuta el cuerpo.
- `return` envía un valor a quien llama y termina la función inmediatamente.
- Una función sin `return` devuelve `None`, así que imprimir no es lo mismo que devolver.
- Devolver varios valores los empaqueta en una tupla que puedes desempaquetar.
- Un docstring justo después de la línea `def` documenta lo que hace la función.
