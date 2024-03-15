import math


def tension_calculator():
    alpha_deg = float(input("Enter the left cable angle with the vertical: "))
    beta_deg = float(input("Enter the right cable angle with the vertical: "))
    weight = float(input("Enter the weight of the sign (in newtons): "))

    if 90 - alpha_deg < 0:
        alpha_deg = math.fabs(alpha_deg - 180)

    if 90 - beta_deg < 0:
        beta_deg = math.fabs(beta_deg - 180)

    alpha = math.radians(alpha_deg)
    beta = math.radians(beta_deg)

    T_R = weight / (math.cos(alpha) + (math.sin(alpha) / math.sin(beta)) * math.cos(beta))
    T_L = T_R * math.sin(beta) / math.sin(alpha)

    print("Tension in the left cable: {:.2f} N".format(T_L))
    print("Tension in the right cable: {:.2f} N".format(T_R))


def run_program(program_number):
    if program_number == 1:
        tension_calculator()


def main_menu():
    while True:
        print("Select the program to run:")
        print("1 - Tension Calculator")
        try:
            program_number = int(input("Enter the number of the program you want to run: "))
            run_program(program_number)

            run_again = input("Do you want to run another program? (1/0): ")
            if run_again.lower() != '1':
                break
        except ValueError:
            print("Please enter a valid number.")
        except Exception as e:
            print("An error occurred: {}".format(e))


main_menu()
