package mat.calc.data;

import java.util.Scanner;
import mat.calc.logic.Calcolatrice;

public class LettoreDati {
    public void leggiDati() {
        Scanner tastiera = new Scanner(System.in);
        System.out.print("Scegli il tipo di operazione tra +,-,*,/:");
        String operazione = tastiera.nextLine();
        System.out.print("Digita il primo valore:");
        String inputUtente1 = tastiera.nextLine();
        System.out.print("Digita il secondo valore:");
        String inputUtente2 = tastiera.nextLine();
        verificaInput(operazione,inputUtente1,inputUtente2);
    }
    private void verificaInput(String op,String i1,String i2) {
        if(!(op.equals("*")||op.equals("/")||op.equals("+")||op.equals("-"))) {
            System.out.println("Operazione non valida");
            return;
        }
        if(i1.matches("(\\+|\\-)?([1-9]\\d*|0)") && i2.matches("(\\+|\\-)?([1-9]\\d*|0)")) {
            int val1 = Integer.parseInt(i1),
                 val2 = Integer.parseInt(i2);
            Calcolatrice calc = new Calcolatrice();
            int result = 0;
            switch(op){
                case "+": result = calc.somma(val1, val2);
                break;
                case "-": result = calc.differenza(val1, val2);
                break;
                case "*": result = calc.moltiplicazione(val1, val2);
                break;
                case "/":
                    if(val2 == 0){
                        System.out.println("Non è possibile dividere per zero");
                        return;
                    }
                    result = calc.divisione(val1, val2);
                break;
            }
            System.out.println("Il risultato è " + result);

        } else {
            System.out.println("Uno o entrambi gli input non sono validi");
        }
    }
}
