import random

def roll():
    return random.randint(1, 6)

while True:
    print(roll())
    choice = input("Roll again? (y/n): ").strip().lower()
    if choice in ("y", "yes"):
        continue
    if choice in ("n", "no"):
        break
