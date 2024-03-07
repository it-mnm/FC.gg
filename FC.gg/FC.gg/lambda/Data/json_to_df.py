import pandas as pd
import json

with open('C:/Users/Hwang/Desktop/FC.gg/FC.gg/lambda/Data/player.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

df = pd.DataFrame(data)
print(df)

df.to_csv('C:/Users/Hwang/Desktop/FC.gg/FC.gg/lambda/Data/player.csv', index=False)