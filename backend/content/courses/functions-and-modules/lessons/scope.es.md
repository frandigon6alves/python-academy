# Ámbito

El **ámbito** (scope) de un nombre es la parte del programa donde ese nombre se puede ver y usar. Entender el ámbito explica por qué una variable creada dentro de una función desaparece cuando la función termina, y por qué algunos cambios "no se quedan".

## Ámbito local

Un nombre asignado dentro de una función es **local** a esa función. Se crea cuando la función se ejecuta y desaparece cuando devuelve su resultado.

```python
def make_message():
    message = "created inside"
    return message


print(make_message())
print("message" in globals())
```

```text
created inside
False
```

Intentar usar `message` fuera de la función lanzaría un `NameError`. Además, cada llamada recibe un conjunto nuevo de nombres locales, así que las llamadas no interfieren entre sí.

## Ámbito global

Los nombres asignados en el nivel superior de un archivo son **globales**. Las funciones pueden leerlos libremente.

```python
tax_rate = 0.2


def with_tax(price):
    return price * (1 + tax_rate)


print(with_tax(50))
```

```text
60.0
```

Pero asignar un nombre dentro de una función crea un **nuevo nombre local**, aunque exista uno global con el mismo nombre. Esto se llama **ocultación** (shadowing):

```python
counter = 0


def increment():
    counter = 1
    return counter


print(increment())
print(counter)
```

```text
1
0
```

El `counter` global nunca se tocó. Si de verdad necesitas reasignar una variable global, declárala con `global`:

```python
counter = 0


def increment():
    global counter
    counter += 1


increment()
increment()
print(counter)
```

```text
2
```

Usa `global` con moderación. Las funciones que reciben sus datos como parámetros y entregan resultados con `return` son mucho más fáciles de entender y de probar.

## Ámbito envolvente y la regla LEGB

Se pueden definir funciones dentro de otras funciones. La función interior puede leer nombres de la exterior, que es su ámbito **envolvente** (enclosing).

Cuando Python busca un nombre, recorre cuatro ámbitos en orden, lo que se conoce como la regla **LEGB**:

1. **L**ocal: la función actual.
2. **E**nvolvente (Enclosing): las funciones exteriores, de dentro hacia fuera.
3. **G**lobal: el nivel superior del módulo.
4. **B**uilt-in (integrado): los nombres que proporciona Python, como `len` y `print`.

Gana la primera coincidencia.

```python
x = "global"


def outer():
    x = "enclosing"

    def inner():
        return x

    return inner()


print(outer())
print(len("LEGB"))
```

```text
enclosing
4
```

`inner` encontró `x` en su ámbito envolvente antes de llegar al global, y `len` se encontró en el ámbito integrado. Por eso también es mala idea llamar `list` o `str` a una variable propia: oculta la función integrada.

## Clausuras

Una función interior **recuerda** las variables envolventes que usa, incluso después de que la función exterior haya terminado. Una función así se llama **clausura** (closure).

```python
def make_multiplier(factor):
    def multiply(n):
        return n * factor

    return multiply


double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))
```

```text
10 15
```

Cada clausura conserva su propio `factor`. Para **reasignar** una variable envolvente desde la función interior, declárala `nonlocal`:

```python
def make_counter():
    count = 0

    def tick():
        nonlocal count
        count += 1
        return count

    return tick


tick = make_counter()
tick()
tick()
print(tick())
```

```text
3
```

## Puntos clave

- Los nombres asignados dentro de una función son locales y desaparecen cuando esta termina.
- Asignar un nombre dentro de una función crea un nombre local, salvo que se declare `global` o `nonlocal`.
- Python resuelve los nombres con la regla LEGB: Local, Envolvente, Global e Integrado.
- Una clausura es una función interior que recuerda variables de su ámbito envolvente.
