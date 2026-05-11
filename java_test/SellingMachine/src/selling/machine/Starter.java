package selling.machine;

import selling.machine.model.Product;

public class Starter {
    public static void main(String[] args) {
        Product acqua = new Product("Acqua", 1.20, 5);
        System.out.println(acqua.getName() + acqua.getCost() + acqua.getPieces() + acqua.isAvailable());
        acqua.changeCost(1);
        System.out.println(acqua.getCost());
        acqua.changePieces(0);
        System.out.println(acqua.getPieces());
        System.out.println(acqua.isAvailable());

    }
}
