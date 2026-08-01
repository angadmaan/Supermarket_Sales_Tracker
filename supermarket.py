
import tkinter as tk
from tkinter import messagebox, ttk
import datetime

inventory = {
    "Apple": {"price": 10, "stock": 50, "unit": "Kg"},
    "Milk": {"price": 30, "stock": 20, "unit": "Litre"},
    "Bread": {"price": 25, "stock": 15, "unit": "Piece"},
    "Eggs": {"price": 5, "stock": 100, "unit": "Piece"},
    "Juice": {"price": 50, "stock": 25, "unit": "Litre"},
    "Rice": {"price": 60, "stock": 40, "unit": "Kg"},
    "Soap": {"price": 20, "stock": 60, "unit": "Piece"},
    "Toothpaste": {"price": 35, "stock": 30, "unit": "Piece"},
    "Oil": {"price": 120, "stock": 25, "unit": "Litre"},
    "Sugar": {"price": 45, "stock": 50, "unit": "Kg"}
}

cart = {}

def add_to_cart():
    item = item_var.get()
    quantity = quantity_var.get()
    if item and quantity.isdigit():
        quantity = int(quantity)
        if item in inventory and quantity <= inventory[item]["stock"]:
            inventory[item]["stock"] -= quantity
            if item in cart:
                cart[item]["quantity"] += quantity
            else:
                cart[item] = {"price": inventory[item]["price"], "quantity": quantity}
            messagebox.showinfo("Added", f"{quantity} {inventory[item]['unit']} of {item} added to cart.")
        else:
            messagebox.showerror("Error", "Insufficient stock or invalid item.")
    else:
        messagebox.showwarning("Warning", "Please select item and valid quantity.")

def generate_bill():
    if not cart:
        messagebox.showerror("Empty Cart", "Cart is empty!")
        return
    total = 0
    bill_text = "----- Supermarket Bill -----\n"
    bill_text += f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    for item, info in cart.items():
        unit = inventory[item]["unit"]
        amount = info["price"] * info["quantity"]
        total += amount
        bill_text += f"{item} x {info['quantity']} {unit} = ₹{amount}\n"
    bill_text += f"\nTotal: ₹{total}\n"

    timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    with open(f"bill_{timestamp}.txt", "w", encoding="utf-8") as f:
        f.write(bill_text)
    with open("sales_history.txt", "a", encoding="utf-8") as f:
        f.write(f"Sale on {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}: ₹{total}\n")

    messagebox.showinfo("Bill Generated", f"Total Amount: ₹{total}\nBill saved as bill_{timestamp}.txt")
    cart.clear()

def view_inventory():
    inv_window = tk.Toplevel(root)
    inv_window.title("Inventory")
    for item, info in inventory.items():
        tk.Label(inv_window, text=f"{item}: ₹{info['price']} per {info['unit']} - {info['stock']} {info['unit']} available").pack()


root = tk.Tk()
root.title("Supermarket Sales Tracker")
root.geometry("400x300")

tk.Button(root, text="View Inventory", command=view_inventory).pack(pady=5)

tk.Label(root, text="Select Item").pack()
item_var = tk.StringVar()
item_menu = ttk.Combobox(root, textvariable=item_var, values=list(inventory.keys()))
item_menu.pack()

tk.Label(root, text="Enter Quantity").pack()
quantity_var = tk.StringVar()
tk.Entry(root, textvariable=quantity_var).pack()

tk.Button(root, text="Add to Cart", command=add_to_cart).pack(pady=5)
tk.Button(root, text="Generate Bill", command=generate_bill).pack(pady=5)
tk.Button(root, text="Exit", command=root.quit).pack(pady=5)

root.mainloop()
