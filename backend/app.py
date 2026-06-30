from flask import *
import os
import requests
import pandas as pd
from dotenv import load_dotenv
from flask_cors import CORS
from matplotlib import use
import matplotlib.pyplot as plt

load_dotenv(".env")
key = os.getenv("coingecko_key")
MARKET_URL = "https://api.coingecko.com/api/v3/coins/markets"

header = {
    "x-cg-demo-api-key": key
}

use('Agg') 

app = Flask(__name__)
CORS(app)

@app.route("/fetch_data", methods=["POST"])
def fetch_data():
    err = None
    try:
        res = request.get_json()
        print(res)
        params = {  
            "ids": res['id'],
            "vs_currency": "usd",
            "sparkline": 'true',
            "price_change_percentage": "1h,24h,7d,14d,30d,200d,1y",
            "precision": 2
        }
        response = requests.get(url=MARKET_URL, params=params, headers=header)
        err = response.status_code
        if err == 200:
            data = response.json()[0]
            print(data.pop('id'))
            print(data.pop('fully_diluted_valuation'))
            print(data.pop('roi'))
            print(data.pop('ath_change_percentage'))
            print(data.pop('ath_date'))
            print(data.pop('atl_change_percentage'))
            print(data.pop('atl_date'))
            fig, ax = plt.subplots(facecolor='#0f131f') # Outer area
            ax.set_facecolor('#0f131f')   
            plt.plot(data['sparkline_in_7d']['price'], color='green', linewidth=1.8, label=f'{data['name']} Trend')
            plt.title("Price Chart", color="white")
            plt.legend()
            ax.tick_params(axis='both', colors="white")
            plt.grid(axis='y', color="#ffffff", alpha=0.2)
            fig.savefig("../assets/icons/graph.png", dpi=300)
            plt.close(fig)

            fig, ax = plt.subplots(facecolor='#fff') # Outer area
            ax.set_facecolor('#fff')   
            plt.plot(data['sparkline_in_7d']['price'], color='green', linewidth=1.8, label=f'{data['name']} Trend')
            plt.legend()
            plt.title("Price Chart", color="black")
            ax.tick_params(axis='both', colors="black")
            plt.grid(axis='y', color="#676767", alpha=0.2)
            fig.savefig("../assets/icons/light_graph.png", dpi=300)
            plt.close(fig)

            df = pd.DataFrame(response.json())
            print(data)
            df.drop(['fully_diluted_valuation', 'roi', 'ath', 'ath_change_percentage', 'ath_date', 'atl', 'atl_change_percentage', 'atl_date'], axis=1, inplace=True)
            print(df)
            
            return jsonify(data), 200
    except requests.ConnectionError as e:
        return {"msg": "Connection Error"}, err
    except requests.HTTPError:
        return {"msg": "HTTPError"}, err
    except requests.ConnectTimeout:
        return {"msg": "Connection Timeout!"}, err
    except ValueError as e:
        return {"msg": "Invalid Json!"}, err
    except Exception as e:
        print(e)
        return {"msg": "Unexpected Error"}, err

@app.route("/fetch-top-coins")
def fetch_top_coins():
    err = None
    try:
        params = {  
            "vs_currency": "usd",
            "sparkline": 'true',
            "precision": 2,
            "per_page": 10
        }
        response = requests.get(url=MARKET_URL, params=params, headers=header)
        err = response.status_code
        if err == 200:
            main_data = []
            i = 1
            for item in response.json():
                data = {}
                data["#"] = i
                data['Coin'] = item['name']
                data['Prices'] = item['current_price']
                data['24h Change'] = item['price_change_percentage_24h']
                data['Market Cap'] = item['market_cap']
                data['24h Volume'] = item['total_volume']
                data['Circulating Supply'] = item['circulating_supply']
                fig, ax = plt.subplots()
                plt.plot(item['sparkline_in_7d']['price'], color='green', linewidth=1.8)
                ax.set_axis_off()
                fig.savefig(f"../assets/sparklines/{item['name']}.png", dpi=300, transparent=True)
                plt.close(fig)
                main_data.append(data)
                i+=1
            return jsonify(main_data), 200
    except requests.ConnectionError as e:
        return {"msg": "Connection Error"}, err
    except requests.HTTPError:
        return {"msg": "HTTPError"}, err
    except requests.ConnectTimeout:
        return {"msg": "Connection Timeout!"}, err
    except ValueError as e:
        return {"msg": "Invalid Json!"}, err
    except Exception as e:
        print(e)
        return {"msg": "Unexpected Error"}, err

    
if __name__ == "__main__":
    app.run(debug=True)