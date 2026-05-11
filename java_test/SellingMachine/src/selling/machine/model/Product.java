package selling.machine.model;

public class Product {
    private String name;
    private double cost;
    private boolean available;
    private int pieces;

    public Product(String nm, double price, int pz) {
        name = nm;
        cost = price;
        pieces = pz;
        if (pieces > 0){
            available = true;
        }else{
            available = false;
        }
    }

    public void changeCost(double newPrice) {
        if (newPrice > 0) {
            cost = newPrice;
            System.out.println("New Price Accepted!");
        } else {
            System.out.println("New Price Refused!");
        }
    }

    public boolean isAvailable() {
        return available;
    }

    public String getName() {
        return name;
    }

    public double getCost() {
        return cost;
    }

    public void changePieces(int pz) {
        pieces = pz;
        if (pieces > 0) {
            available = true;
            System.out.println("I pezzi disponibili sono ora " + pieces);
        } else {
            available = false;
            System.out.println("Non ci sono pezzi disponibili");
        }
    }

   public int getPieces(){
      return pieces;
   }
}
