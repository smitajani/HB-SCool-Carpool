# Faker Integration to seed database.

# Import Faker libraries and instantiate object fake_data
from faker import Faker
fake_data = Faker()
import csv

# name = fake_data.name()
# address = fake_data.address()
# email = fake_data.email()
# phone = fake_data.phone_number()

def create_parent_child_list(total_parents):
    parent = {}
    for count in range(total_parents):
        #  For phone number, get the last 10 digits of the msisdn number
        parent[count] = [fake_data.name(), fake_data.address(), fake_data.email(), fake_data.msisdn()[-10:]]
    return parent

with open('fake_data.csv', 'w', newline='') as csvfile:
    csv_fake_data = csv.writer(csvfile)
    parent_list = create_parent_child_list(20)

    for parent_row in parent_list.items():
        print(parent_row[1])
        csv_fake_data.writerow(parent_row[1])


