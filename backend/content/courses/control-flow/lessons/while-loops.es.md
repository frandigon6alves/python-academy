# Bucles while

Un bucle `while` repite su cuerpo **mientras una condición sea verdadera**. Úsalo cuando no sabes de antemano cuántas repeticiones necesitas.

## La forma básica

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

Antes de cada vuelta, Python comprueba la condición. Si es verdadera, se ejecuta el cuerpo; si es falsa, el bucle termina y el programa continúa después de él. Si la condición es falsa desde el principio, el cuerpo no llega a ejecutarse nunca.

## Evitar bucles infinitos

El cuerpo de un bucle `while` debe acabar haciendo falsa la condición. Si olvidas actualizar `countdown` en el ejemplo anterior, el bucle imprimiría `3` para siempre. Si te pasa mientras experimentas, pulsa **Ctrl+C** en la terminal para detener el programa.

Un buen hábito es hacerse tres preguntas sobre cada bucle `while`:

1. ¿Qué variable controla la condición?
2. ¿Dónde cambia dentro del bucle?
3. ¿Ese cambio la acerca a que la condición sea falsa?

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

Aquí `balance` crece en cada vuelta, así que el bucle seguro que termina.

## Salir antes con break

`break` sale del bucle inmediatamente, saltándose el resto del cuerpo y las vueltas que falten.

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

`break` funciona tanto en bucles `for` como `while`. Un patrón muy usado es `while True:` combinado con `break`, que se lee como "sigue hasta que yo diga basta". Es habitual en menús o para preguntar a la persona usuaria hasta que dé una respuesta válida:

```python
while True:
    answer = input("Type yes or no: ").lower()
    if answer in ("yes", "no"):
        break
    print("Please answer yes or no.")
print("You said", answer)
```

## Saltar con continue

`continue` se salta el resto de la vuelta actual y pasa directamente a la siguiente.

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

Los números pares llegan a `continue`, así que solo los impares alcanzan el `print()`.

Ten cuidado con `continue` dentro de un bucle `while`: si la línea que actualiza tu contador va después del `continue`, se la saltará y puede que el bucle no termine nunca.

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

Actualizar `i` al principio del cuerpo mantiene este bucle a salvo.

## ¿for o while?

Usa `for` cuando recorres una colección o un rango conocido de números. Usa `while` cuando el bucle depende de algo que cambia de forma impredecible, como lo que escribe la persona usuaria o un valor que debe alcanzar un objetivo.

## Puntos clave

- Un bucle `while` se ejecuta mientras su condición es verdadera y puede ejecutarse cero veces.
- Asegúrate de que el cuerpo acerque la condición a falso, o el bucle no terminará nunca.
- `break` sale de un bucle inmediatamente; `continue` salta a la siguiente vuelta.
- `while True:` con `break` es un patrón limpio para repetir hasta lograr un objetivo.
