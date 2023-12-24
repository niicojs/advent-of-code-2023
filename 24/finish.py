from sympy import *
init_printing()

x, y, z, dx, dy, dz = symbols('x y z dx dy dz')
equations = [];
equations.append((219051609191782 - x) * (dy - (364)) - (68260434807407 - y) * (dx - (146)))
equations.append((219051609191782 - x) * (dz - (-22)) - (317809635461867 - z) * (dx - (146)))
equations.append((292151991892724 - x) * (dy - (-280)) - (394725036264709 - y) * (dx - (-43)))
equations.append((292151991892724 - x) * (dz - (-32)) - (272229701860796 - z) * (dx - (-43)))
equations.append((455400538938496 - x) * (dy - (219)) - (167482380286201 - y) * (dx - (-109)))
equations.append((455400538938496 - x) * (dz - (-58)) - (389150487664328 - z) * (dx - (-109)))
equations.append((199597051713828 - x) * (dy - (104)) - (198498491378597 - y) * (dx - (134)))
equations.append((199597051713828 - x) * (dz - (-62)) - (230104579246572 - z) * (dx - (134)))
solve(equations)
