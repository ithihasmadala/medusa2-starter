#!/usr/bin/env python3
import csv
import random
from decimal import Decimal

def get_base_price_gbp(product_title, product_type_id):
    """Get base price in GBP based on product type and specific product"""
    
    # Injectable Steroids (ptyp_01JXRF9CPNJJZD06R7ZN7385XE)
    if product_type_id == "ptyp_01JXRF9CPNJJZD06R7ZN7385XE":
        if "test" in product_title.lower() and "blend" in product_title.lower():
            return random.uniform(45, 65)  # Test blends
        elif "test" in product_title.lower():
            return random.uniform(35, 55)  # Regular testosterone
        elif "tren" in product_title.lower():
            return random.uniform(55, 85)  # Trenbolone compounds
        elif "deca" in product_title.lower() or "npp" in product_title.lower():
            return random.uniform(40, 60)  # Nandrolone compounds
        elif "masteron" in product_title.lower():
            return random.uniform(50, 70)  # Masteron
        elif "primobolan" in product_title.lower():
            return random.uniform(70, 95)  # Primobolan
        elif "parabolan" in product_title.lower():
            return random.uniform(80, 110)  # Parabolan
        elif "boldenone" in product_title.lower():
            return random.uniform(45, 65)  # Boldenone
        elif "ment" in product_title.lower():
            return random.uniform(90, 120)  # MENT
        elif "mass" in product_title.lower() or "rip" in product_title.lower():
            return random.uniform(55, 75)  # Blends
        else:
            return random.uniform(40, 70)  # Other injectables
    
    # Oral Steroids (ptyp_01JXRF86Z35XMM7JH5AH2FKA24)
    elif product_type_id == "ptyp_01JXRF86Z35XMM7JH5AH2FKA24":
        if "anavar" in product_title.lower():
            return random.uniform(55, 75)  # Anavar
        elif "winstrol" in product_title.lower():
            return random.uniform(35, 50)  # Winstrol
        elif "dianabol" in product_title.lower():
            return random.uniform(25, 40)  # Dianabol
        elif "superdrol" in product_title.lower():
            return random.uniform(45, 65)  # Superdrol
        elif "turinabol" in product_title.lower():
            return random.uniform(40, 60)  # Turinabol
        elif "halotestin" in product_title.lower():
            return random.uniform(70, 95)  # Halotestin
        elif "oxy" in product_title.lower() or "anadrol" in product_title.lower():
            return random.uniform(45, 65)  # Anadrol
        elif "primo" in product_title.lower():
            return random.uniform(65, 85)  # Primo tabs
        elif "triple" in product_title.lower():
            return random.uniform(50, 70)  # Triple X
        else:
            return random.uniform(30, 60)  # Other orals
    
    # Fat Burners (pt_fatburner)
    elif product_type_id == "pt_fatburner":
        if "liquid" in product_title.lower():
            return random.uniform(35, 55)  # Liquid fat burners
        elif "clenbuterol" in product_title.lower() or "clen" in product_title.lower():
            return random.uniform(25, 40)  # Clenbuterol
        elif "t3" in product_title.lower():
            return random.uniform(30, 45)  # T3
        elif "t4" in product_title.lower():
            return random.uniform(25, 40)  # T4
        elif "t5" in product_title.lower():
            return random.uniform(40, 60)  # T5
        elif "yohimbine" in product_title.lower():
            return random.uniform(20, 35)  # Yohimbine
        elif "burn" in product_title.lower():
            return random.uniform(30, 50)  # Fat burner tabs
        else:
            return random.uniform(25, 45)  # Other fat burners
    
    # PCT (pt_pct)
    elif product_type_id == "pt_pct":
        if "pct" in product_title.lower() and "40" in product_title.lower():
            return random.uniform(45, 65)  # PCT blends
        elif "clomid" in product_title.lower():
            return random.uniform(25, 40)  # Clomid
        elif "nolvadex" in product_title.lower():
            return random.uniform(25, 40)  # Nolvadex
        elif "arimidex" in product_title.lower():
            return random.uniform(35, 50)  # Arimidex
        elif "aromasin" in product_title.lower():
            return random.uniform(35, 50)  # Aromasin
        elif "letrozole" in product_title.lower():
            return random.uniform(30, 45)  # Letrozole
        elif "proviron" in product_title.lower():
            return random.uniform(30, 45)  # Proviron
        else:
            return random.uniform(25, 50)  # Other PCT
    
    # Default fallback
    else:
        return random.uniform(30, 60)

def convert_currency(gbp_price, currency):
    """Convert GBP to other currencies with realistic exchange rates"""
    if currency == "USD":
        return gbp_price * 1.27  # GBP to USD
    elif currency == "CAD":
        return gbp_price * 1.71  # GBP to CAD
    else:
        return gbp_price

def get_quantity():
    """Generate realistic stock quantities"""
    # Weight distribution: more products with medium stock, fewer with very high/low stock
    rand = random.random()
    if rand < 0.1:  # 10% chance of low stock
        return random.randint(1, 5)
    elif rand < 0.2:  # 10% chance of very high stock
        return random.randint(100, 200)
    elif rand < 0.4:  # 20% chance of high stock
        return random.randint(50, 99)
    else:  # 60% chance of medium stock
        return random.randint(10, 49)

def update_csv_with_pricing():
    """Update the CSV file with pricing and quantity information"""
    
    input_file = "1749988189725-product-exports.csv"
    output_file = "1749988189725-product-exports-with-pricing.csv"
    
    # Read the original CSV
    with open(input_file, 'r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        
        # Add new columns for pricing and quantity
        new_fieldnames = list(fieldnames) + [
            'Price GBP', 'Price USD', 'Price CAD', 'Quantity'
        ]
        
        rows = []
        for row in reader:
            # Get base price in GBP
            base_price_gbp = get_base_price_gbp(
                row['Product Title'], 
                row['Product Type Id']
            )
            
            # Convert to other currencies
            price_usd = convert_currency(base_price_gbp, "USD")
            price_cad = convert_currency(base_price_gbp, "CAD")
            
            # Generate quantity
            quantity = get_quantity()
            
            # Add pricing and quantity to row
            row['Price GBP'] = f"{base_price_gbp:.2f}"
            row['Price USD'] = f"{price_usd:.2f}"
            row['Price CAD'] = f"{price_cad:.2f}"
            row['Quantity'] = str(quantity)
            
            rows.append(row)
    
    # Write the updated CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=new_fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"Updated CSV saved as: {output_file}")
    print(f"Added pricing in GBP, USD, CAD and quantity information for {len(rows)} products")

if __name__ == "__main__":
    # Set random seed for reproducible results
    random.seed(42)
    update_csv_with_pricing() 