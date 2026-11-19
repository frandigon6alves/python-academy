# Tipos

Todo valor en Python tiene un **tipo**. El tipo decide qué puede hacer ese valor: puedes dividir números, pero no frases. Veamos los tipos integrados más comunes.

## Números

Los números enteros son `int` y los números con punto decimal son `float`.

```python
apples = 7
price = 2.5
print(apples * price)
print(7 / 2)
print(7 // 2)
print(7 % 2)
print(2**10)
```

```text
17.5
3.5
3
1
1024
```

Fíjate en que `/` siempre devuelve un float, incluso cuando el resultado es exacto. Usa `//` para la división entera (redondea hacia abajo) y `%` para el resto. `**` eleva un número a una potencia.

Los enteros en Python pueden ser tan grandes como permita la memoria, así que nunca tienes que preocuparte por el desbordamiento. Los floats, en cambio, se guardan en binario y pueden mostrar pequeños errores de redondeo:

```python
print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
```

```text
0.30000000000000004
0.3
```

## Booleanos

El tipo `bool` tiene exactamente dos valores: `True` y `False`. Normalmente salen de comparaciones.

```python
is_adult = 20 >= 18
print(is_adult)
print(3 == 4)
```

```text
True
False
```

## None

`None` es un valor especial que significa "aquí no hay nada" o "todavía no hay valor". Es el único valor de su tipo, `NoneType`.

```python
winner = None
print(winner)
print(winner is None)
```

```text
None
True
```

Para comprobar si algo es `None`, usa `is None` en lugar de `== None`.

## Consultar el tipo con type()

La función integrada `type()` te dice el tipo de cualquier valor.

```python
print(type(42))
print(type(3.14))
print(type("hi"))
print(type(True))
print(type(None))
```

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

## Convertir entre tipos

Puedes convertir un valor a otro tipo llamando al nombre del tipo como si fuera una función: `int()`, `float()` y `str()`.

```python
print(int("42") + 1)
print(float("3.5") * 2)
print(str(100) + " points")
print(int(9.99))
```

```text
43
7.0
100 points
9
```

Conviene recordar dos detalles. Primero, `int()` aplicado a un float **trunca** hacia cero; no redondea. Segundo, la conversión solo funciona cuando tiene sentido: `int("hello")` lanza un `ValueError` porque "hello" no es un número.

Mezclar tipos sin convertir es un error típico al empezar. `"Age: " + 30` falla porque Python no une texto y números en silencio. Escribe `"Age: " + str(30)`, o usa un f-string, que conocerás muy pronto.

También puedes convertir valores en booleanos con `bool()`. El cero, las cadenas vacías y `None` se convierten en `False`; la mayoría de los demás valores, en `True`.

```python
print(bool(0), bool(""), bool("0"), bool(5))
```

```text
False False True True
```

## Puntos clave

- `int` guarda números enteros, `float` guarda decimales y `bool` guarda `True` o `False`.
- `/` siempre produce un float; `//` es la división entera y `%` da el resto.
- `None` representa la ausencia de valor; compruébalo con `is None`.
- `type()` muestra el tipo de un valor, y `int()`, `float()` y `str()` convierten entre tipos.
- `int()` trunca los floats, y las conversiones no válidas lanzan un `ValueError`.
