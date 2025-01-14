import pandas as pd
import dill

with open('best_model.pkl', 'rb') as file:
  loaded_model = dill.load(file)

def preprocess(df):
    # if(df['status']=='completed'):
    #     return 0
    today_date = pd.Timestamp('today').normalize().date()
    df['due_date'] = pd.to_datetime(df['due_date'])
    df['remaining_days'] = (pd.to_datetime(df['due_date']) - pd.to_datetime(today_date)).dt.days
    df.loc[df['status'] == 'completed', 'remaining_days'] = 0
    df=df.drop(columns=['due_date'])
    return  loaded_model.predict(df)