var laborYear = document.getElementById("labor-year")
var laborMonth = document.getElementById("labor-month")
var laborDay = document.getElementById("labor-day")

var laborThres = document.getElementById("labor-thres")

var nationYear = document.getElementById("nation-year")
var nationMonth = document.getElementById("nation-month")
var nationDay = document.getElementById("nation-day")

var cal_year_butt = document.getElementById("cal-years")
var yearResult = document.getElementById("year-result")


var dealAmount = document.getElementById("deal-amount")

var laborPrincipal = document.getElementById("labor-principal")
var laborRateA = document.getElementById("labor-rate-a")
var laborMinA = document.getElementById("labor-min-a")
var laborRateB = document.getElementById("labor-rate-b")

var nationPrincipal = document.getElementById("nation-principal")
var nationRateA = document.getElementById("nation-rate-a")
var nationMinA = document.getElementById("nation-min-a")
var nationRateB = document.getElementById("nation-rate-b")

var calMoneyButt = document.getElementById("cal-money")

var laborResult = document.getElementById("labor-result")
var nationResult = document.getElementById("nation-result")
var suggestResult = document.getElementById("suggest-result")

var labor_year_total = 0.0
var nation_year_total = 0.0

const LABOR_THRES = laborThres.valueAsNumber

const SHOW_DISPLAY = dealAmount.style.display
dealAmount.style.display = "none"

cal_year_butt.addEventListener("click",calcu_years)
calMoneyButt.addEventListener("click", calculate_all)

const RUN_THRES = 20


var labor_month_allow = false


function sum_years(year, month, day, round_up=false){
    var print_str = `${year}年 ${month}月 ${day}日`
    var day_total = day/30.0

    if (round_up){
        day_total = Math.ceil(day_total)
        print_str = print_str + `(畸零日進位 增加一個月)`
    }
    else{
        print_str = print_str + `(畸零日按比例 不進位)`
    }
    
    var month_total = month + day_total
    const month_total_print = Number((month_total).toFixed(3))
    print_str = print_str + ` ---> ${year}年 ${month_total_print}月`
    
    month_total = month_total/ 12.0
    var year_total = year + month_total
    const year_total_print = Number((year_total).toFixed(3))
    print_str = print_str + ` ---> ${year_total_print}年`

    var return_obj = {
        result_str: print_str,
        year_total: year_total_print
    }

    return return_obj
}

function calcu_years(){
    var labor_year = laborYear.valueAsNumber
    var labor_month = laborMonth.valueAsNumber
    var labor_day = laborDay.valueAsNumber

    var nation_year = nationYear.valueAsNumber
    var nation_month = nationMonth.valueAsNumber
    var nation_day = nationDay.valueAsNumber


    var labor_obj = sum_years(labor_year, labor_month, labor_day, round_up=true)
    var labor_str = labor_obj.result_str
    labor_year_total = labor_obj.year_total
    var labor_result = "勞保年資: " + labor_str + "<br>"

    // clear yearResult at first time
    yearResult.innerHTML = ""
    yearResult.innerHTML = yearResult.innerHTML + labor_result

    var nation_obj = sum_years(nation_year, nation_month, nation_day, round_up=false)
    var nation_str = nation_obj.result_str
    nation_year_total = nation_obj.year_total
    var nation_result = "國民年金年資: " + nation_str + "<br>"
    yearResult.innerHTML = yearResult.innerHTML + nation_result

    // determine if labor monthly allowed
    // check combined
    var year_total = labor_year_total + nation_year_total
    var determine_str = `合計年資為${year_total}年<br><br>`
    if (labor_year_total >= LABOR_THRES){
        determine_str = determine_str + `勞保年資單獨超過${LABOR_THRES}年，可以勞保老年給付月領`
        labor_month_allow = true
    }
    else {
        // labor years below threshold
        determine_str = determine_str + `勞保年資單過短，`

        if (year_total >= LABOR_THRES){
            determine_str = determine_str + `然而與國民年金合併超過${LABOR_THRES}年，仍可勞保老年給付月領`
            labor_month_allow = true
        }
        else{
            determine_str = determine_str + `與國民年金合併仍低於${LABOR_THRES}年，勞保無法月領，只能勞保一次金`
        }
    }

    yearResult.innerHTML = yearResult.innerHTML + determine_str

    dealAmount.style.display = SHOW_DISPLAY
}


function calcu_money(principal, years, rate=100.0, base=0.0){
    return (principal * years * rate) * 0.01 + base 
}

function calculate_all(){
    var labor_principal = laborPrincipal.valueAsNumber
    var labor_rate_a = laborRateA.valueAsNumber
    var labor_min_a = laborMinA.valueAsNumber
    var labor_rate_b = laborRateB.valueAsNumber

    var nation_principal = nationPrincipal.valueAsNumber
    var nation_rate_a = nationRateA.valueAsNumber
    var nation_min_a = nationMinA.valueAsNumber
    var nation_rate_b = nationRateB.valueAsNumber

    

    var labor_one_time = calcu_money(labor_principal, labor_year_total, rate=100.0, base=0.0)
    const labor_one_time_print = Number((labor_one_time).toFixed(3))
    var labor_result = `勞保金額如下:<br>勞保一次金: ${labor_principal} X ${labor_year_total} = ${labor_one_time_print}元<br><br>`

    var labor_a = calcu_money(labor_principal, labor_year_total, rate=labor_rate_a, base=labor_min_a)
    var labor_b = calcu_money(labor_principal, labor_year_total, rate=labor_rate_b, base=0.0)
    var labor_max = Math.max(labor_a, labor_b)

    const labor_a_print = Number((labor_a).toFixed(3))
    const labor_b_print = Number((labor_b).toFixed(3))
    const labor_max_print = Number((labor_max).toFixed(3))

    if (labor_month_allow){
        

        labor_result = labor_result + `勞保給付一式: ${labor_principal} X ${labor_year_total} X ${labor_rate_a}% + ${labor_min_a} = ${labor_a_print}元<br>`
        labor_result = labor_result + `勞保給付二式: ${labor_principal} X ${labor_year_total} X ${labor_rate_b}% = ${labor_b_print}元<br>`
        labor_result = labor_result + `擇優取其大，勞保老年給付 月領${labor_max_print}元<br>`
    }
    else{
        labor_result = labor_result + `年資過短、不得勞保給付月領<br>`
    }
    laborResult.innerHTML = labor_result + `<br>`
    

    var nation_result = '國民年金如下:<br>'

    var nation_a = calcu_money(nation_principal, nation_year_total, rate=nation_rate_a, base=nation_min_a)
    var nation_b = calcu_money(nation_principal, nation_year_total, rate=nation_rate_b, base=0.0)

    const nation_a_print = Number((nation_a).toFixed(3))
    const nation_b_print = Number((nation_b).toFixed(3))

    nation_result = nation_result + `國民年金A式: ${nation_principal} X ${nation_year_total} X ${nation_rate_a}% + ${nation_min_a} = ${nation_a_print}元<br>`
    nation_result = nation_result + `國民年金B式: ${nation_principal} X ${nation_year_total} X ${nation_rate_b}% = ${nation_b_print}元<br>`
    nationResult.innerHTML = nation_result + `<br>`



    var suggest_str = `組合一: 勞保一次金(${labor_one_time_print})、 單獨國民年金A式= 月領${nation_a_print}元<br>`

    if (labor_month_allow){
        //direct using rounding result
        const labor_nat_b_print = Number((labor_max_print + nation_b_print).toFixed(3))

        suggest_str = suggest_str + `組合二(雙年金): 勞保老年給付${labor_max_print} + 國民年金B式${nation_b_print} = 月領${labor_nat_b_print}元<br><br>`

        if (labor_nat_b_print > nation_a_print){
            var diff = labor_nat_b_print - nation_a_print
            var run_month = labor_one_time_print / diff

            const diff_print = Number((diff).toFixed(3))
            const run_month_print = Number((run_month % 12).toFixed(3))
            const run_year_print = Number((run_month / 12.0).toFixed(0))

            suggest_str = suggest_str + `雙年金比單獨國民A式 每月多${diff_print}元，約${run_year_print}年${run_month_print}月可超過 組合一之勞保一次金<br>`

            if (run_year_print < RUN_THRES){
                suggest_str = suggest_str + `推薦領雙年金: 勞保老年給付 + 國民年金B式<br>`
            }
            else{
                suggest_str = suggest_str + `有點微妙，差距不大，若喜歡先拿勞保一次金、單獨國民A式OK；喜歡雙年金(勞保給付+國民B式)也OK<br>`
            }
        }
        else{
            suggest_str = suggest_str + `單獨領國保A式 月領較多<br>`
        }

    }
    else{
        suggest_str = suggest_str + `年資過短 只剩這個組合<br>`
    }
    


    suggestResult.innerHTML = suggest_str
    

}