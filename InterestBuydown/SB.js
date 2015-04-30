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
var termYears = termMonths / 12;
var amortizationMonths = 300;
var amortizationYears = amortizationMonths / 12; //g15
var daysPerMonth = 30.416666667;
var constantExponent = 0.166666667; //g19
var semiAnnualRate = buydownRate/200;//f10
var totalBuydownAmount=0;
var m10 = currentSprRate/200; 

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
    return (principalBalance*( a*b/(c-1)));
}

//var equivMonthlyPayment = calcEquivalentMonthlyPayment();
function calcProjectedBalanceToEndOfCurrentTerm() //g97
{   
    var paymentsPerYear = 12;
    var g70 = Math.pow((1+m10),(constantExponent*paymentsPerYear*termYears));
    var g73=g70-1;
    var g76 = Math.pow((1+m10),constantExponent)-1;
    var g81 =g73/g76;
    var g86=principalBalance*g70;
    var g90= m28*g81
    var g97 = g86-g90;   
    return g97;
}

function calcPresentValueMaturityBalanceAtBuydown(){       
    var f115 = (calcProjectedBalanceToEndOfCurrentTerm())*(1/(      Math.pow( (1+semiAnnualRate),(constantExponent*termMonths))   ))
    return f115;
}

function calcPresentValuePaymentsAtBuydown(){ //f128   
    var f108 = buydownRate/200;
    var f128 = m28*((1-(1/(         Math.pow( (1+f108),(constantExponent*termMonths) )         )))/( Math.pow( (1+semiAnnualRate),constantExponent )  -1));
    return f128;
}


function calcPresentValueOfLoan(){//f138   
    return calcPresentValueMaturityBalanceAtBuydown()+calcPresentValuePaymentsAtBuydown();
}

var semiAnnRatef151 = currentSprRate/200;

function calcPresentValMaturityBalanceAtCurrentMarketRate(){ //f157
    
    var f157 = (calcProjectedBalanceToEndOfCurrentTerm())*(1/(   Math.pow((1+semiAnnRatef151),(constantExponent*termMonths))   ))
    return f157;
}

function calcPresentValueOfPaymentsCurrRate(){ //f170
    
    var f170 = m28*((1-(1/(   Math.pow((1+semiAnnRatef151),(constantExponent*termMonths) )  )))/(  Math.pow((1+semiAnnRatef151),(constantExponent) )  -1));
    return f170;
}

function calcPresentValueLoan2(){ //f180
    return calcPresentValMaturityBalanceAtCurrentMarketRate()+calcPresentValueOfPaymentsCurrRate();
}

function calcInterestRateBuydown(){ //e195
    var e192=calcPresentValueOfLoan() - calcPresentValueLoan2();
    var penalty=0;
    var e195= e192+penalty;
    return e195;
}
var xa = calcInterestRateBuydown();
console.log(xa);
 

