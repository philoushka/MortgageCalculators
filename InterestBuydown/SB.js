var consoleLine = "<p class=\"console-line\"></p>";
 
console = {
    log: function (text) {
        $("#console-log").append($(consoleLine).html(text));
    }
};
 
var principalBalance = 250000; //f5
var currentSprRate = 5.8500;//f6
var buydownRate = 5.7500; //f7
var termMonths = 60; //f8 or f110
var paymentsPerYear = 12;
var termYears = termMonths / paymentsPerYear;
var amortizationMonths = 300;
var amortizationYears = amortizationMonths / paymentsPerYear; //g15
var daysPerMonth = 30.416666667;
var constantExponent = 0.166666667; //g19
var semiAnnualRate = buydownRate/200;//f10
var totalBuydownAmount=0;
var penalty=0;
var m10 = currentSprRate/200; 
var semiAnnRatef151 = currentSprRate/200;

function calcM28(){    
    var a = Math.pow((1+m10),(2*amortizationYears));
    var b = Math.pow(1+m10,constantExponent)-1;
    var c = Math.pow(1+m10,2*amortizationYears);
    return (principalBalance*(a*b/(c-1)));
}

var m28 = calcM28();

function calcEquivalentMonthlyPayment() { //g28
    var a = Math.pow((1+semiAnnualRate),(2*amortizationYears));
    var b = Math.pow(1+semiAnnualRate,constantExponent)-1;
    var c = Math.pow(1+semiAnnualRate,2*amortizationYears);
    return (principalBalance*(a*b/(c-1)));
}

function calcProjectedBalanceToEndOfCurrentTerm() //g97
{       
    var g70 = Math.pow((1+m10),(constantExponent*paymentsPerYear*termYears));
    var g73=g70-1;
    var g76 = Math.pow((1+m10),constantExponent)-1;    
    var g86=principalBalance*g70;
    var g90= m28*(g73/g76);
    return g86-g90;
}

function calcPresentValueMaturityBalanceAtBuydown(){       //f115
    return (calcProjectedBalanceToEndOfCurrentTerm())*(1/( Math.pow( (1+semiAnnualRate),(constantExponent*termMonths)) ));    
}

function calcPresentValuePaymentsAtBuydown(){ //f128   
    var f108 = buydownRate/200;
    return m28*((1-(1/( Math.pow((1+f108),(constantExponent*termMonths)))))/( Math.pow( (1+semiAnnualRate),constantExponent )  -1));    
}

function calcPresentValueOfLoan(){//f138   
    return calcPresentValueMaturityBalanceAtBuydown()+calcPresentValuePaymentsAtBuydown();
}

function calcPresentValMaturityBalanceAtCurrentMarketRate(){ //f157    
    return (calcProjectedBalanceToEndOfCurrentTerm())*(1/(   Math.pow((1+semiAnnRatef151),(constantExponent*termMonths))   ))    
}

function calcPresentValueOfPaymentsCurrRate(){ //f170    
    return m28*((1-(1/(   Math.pow((1+semiAnnRatef151),(constantExponent*termMonths) )  )))/(  Math.pow((1+semiAnnRatef151),(constantExponent) )  -1));    
}

function calcPresentValueLoan2(){ //f180
    return calcPresentValMaturityBalanceAtCurrentMarketRate()+calcPresentValueOfPaymentsCurrRate();
}

function calcInterestRateBuydown(){ //e195      
    return calcPresentValueOfLoan() - calcPresentValueLoan2()+penalty;    
}
var xa = calcInterestRateBuydown();
console.log(xa);
 

