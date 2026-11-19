# Variables

Una variable es un nombre que apunta a un valor. Se crea escribiendo un nombre, un signo igual y el valor que quieres guardar. No hace falta ninguna palabra especial ni declarar un tipo antes.

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

El signo `=` se llama **operador de asignación**. Léelo como "haz que este nombre se refiera a este valor", no como "es igual a". Python evalúa primero el lado derecho y después asocia el nombre de la izquierda al resultado.

## Reasignar una variable

Una variable puede apuntar a un valor nuevo en cualquier momento. Ese nombre simplemente olvida el valor anterior.

```python
score = 10
score = score + 5
print(score)
```

```text
15
```

En la segunda línea, Python calcula primero `score + 5` con el valor actual (10) y solo entonces hace que `score` se refiera a 15. Este patrón es tan habitual que Python tiene un atajo: `score += 5`. Existen atajos parecidos como `-=`, `*=` y `/=`.

Un nombre puede incluso pasar a un valor de un tipo completamente distinto. Python tiene **tipado dinámico**, lo que significa que el tipo pertenece al valor, no al nombre.

```python
thing = 42
thing = "now I am text"
print(thing)
```

```text
now I am text
```

Esta flexibilidad es útil, pero reutilizar un mismo nombre para datos que no tienen relación vuelve el código confuso enseguida. Es mejor que cada nombre tenga un único propósito claro.

## Reglas para los nombres

Los nombres de variables deben cumplir algunas reglas:

- Pueden contener letras, dígitos y guiones bajos.
- No pueden empezar por un dígito (`2fast` no es válido, `fast2` sí).
- Distinguen mayúsculas de minúsculas: `total` y `Total` son variables distintas.
- No pueden ser palabras reservadas como `if`, `for`, `class` o `True`.

Además de las reglas, hay convenciones. La comunidad de Python escribe los nombres de variables en **snake_case**: palabras en minúscula unidas por guiones bajos, como `user_name` o `max_speed`. Elige nombres que describan el valor: `price` le dice mucho más a quien lee que `p`.

## Asignación múltiple

Puedes asignar varias variables en una sola línea separando nombres y valores con comas.

```python
x, y, z = 1, 2, 3
print(x, y, z)
```

```text
1 2 3
```

Esto también ofrece una forma elegante de intercambiar dos valores sin una variable temporal:

```python
a = "left"
b = "right"
a, b = b, a
print(a, b)
```

```text
right left
```

También puedes dar el mismo valor a varios nombres a la vez con `a = b = 0`.

## Constantes por convención

Python no tiene constantes de verdad, pero los nombres escritos TODO_EN_MAYÚSCULAS indican a otras personas programadoras que ese valor no debería cambiar.

```python
MAX_PLAYERS = 4
print("Up to", MAX_PLAYERS, "players")
```

```text
Up to 4 players
```

## Puntos clave

- Una variable es un nombre que se refiere a un valor y se crea con `=`.
- Primero se evalúa el lado derecho y después el nombre se asocia al resultado.
- Los nombres usan snake_case, distinguen mayúsculas y no pueden empezar por un dígito ni ser una palabra reservada.
- La asignación múltiple, como `a, b = b, a`, intercambia valores en un solo paso.
- Los nombres en MAYÚSCULAS son una convención para valores que no deberían cambiar.
