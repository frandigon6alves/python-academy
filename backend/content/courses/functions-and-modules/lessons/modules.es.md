# Módulos

A medida que los programas crecen, tenerlo todo en un solo archivo se vuelve un caos. Un **módulo** es simplemente un archivo de Python cuyas funciones, clases y variables puedes reutilizar en otro sitio. Además, Python incluye una gran **biblioteca estándar** de módulos listos para usar.

## Importar un módulo

Usa `import` seguido del nombre del módulo. Después accedes a su contenido con un punto.

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

Mantener el nombre del módulo como prefijo deja claro de dónde viene cada nombre.

## Importar nombres concretos

`from ... import ...` trae los nombres elegidos directamente a tu archivo, así que puedes usarlos sin prefijo.

```python
from math import gcd, factorial

print(gcd(24, 36))
print(factorial(5))
```

```text
12
120
```

Evita `from module import *`. Vuelca todos los nombres en tu archivo, oculta de dónde viene cada cosa y puede sobrescribir en silencio tus propios nombres.

## Alias

`as` da a un módulo o a un nombre un alias más corto o más claro.

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

Algunos alias son tan comunes que en la práctica son estándar en la comunidad, pero prioriza siempre la legibilidad sobre la brevedad.

## Un recorrido por tres módulos estándar

El módulo `random` genera valores pseudoaleatorios. Su salida cambia en cada ejecución, así que aquí no se muestra:

```python
import random

print(random.randint(1, 6))
print(random.choice(["rock", "paper", "scissors"]))
cards = [1, 2, 3, 4, 5]
random.shuffle(cards)
print(cards)
```

`randint(a, b)` incluye ambos extremos, `choice()` elige un elemento y `shuffle()` reordena una lista en su sitio.

El módulo `datetime` trabaja con fechas y horas. Aquí usamos una fecha fija para que la salida sea predecible:

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

`timedelta` representa una duración, `strftime()` da formato de texto a una fecha y `weekday()` devuelve 0 para el lunes hasta 6 para el domingo, así que 4 significa viernes. Usa `date.today()` o `datetime.now()` para obtener la fecha o la hora actuales.

## Escribir tu propio módulo

Cualquier archivo `.py` es un módulo. Imagina un archivo llamado `geometry.py`:

```python
def circle_area(radius):
    """Return the area of a circle."""
    return 3.14159 * radius**2
```

Otro archivo de la misma carpeta puede usarlo con `import geometry` y llamar a `geometry.circle_area(2)`.

## La guarda `if __name__ == "__main__":`

Cuando Python ejecuta un archivo, asigna una variable especial `__name__`. Si el archivo se ejecuta directamente, `__name__` vale `"__main__"`. Si el archivo se importa, `__name__` vale el nombre del módulo.

Esto permite que un mismo archivo funcione como módulo reutilizable y como script ejecutable:

```python
def circle_area(radius):
    return 3.14159 * radius**2


if __name__ == "__main__":
    print(f"Demo: {circle_area(1):.2f}")
```

```text
Demo: 3.14
```

Ejecutar este archivo directamente imprime la demostración. Importarlo desde otro archivo da acceso a `circle_area` sin ejecutar el código de demostración. Un grupo de módulos organizados en una carpeta se llama **paquete**.

## Puntos clave

- `import module` conserva el prefijo del módulo; `from module import name` trae nombres concretos.
- `as` crea un alias, y es mejor evitar `from module import *`.
- La biblioteca estándar ofrece de serie módulos como `math`, `random` y `datetime`.
- Todo archivo `.py` es un módulo que puedes importar.
- El código bajo `if __name__ == "__main__":` solo se ejecuta cuando el archivo se lanza directamente.
