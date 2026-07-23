var laborYear = document.getElementById("labor-year")
var laborMonth = document.getElementById("labor-month")
var laborDay = document.getElementById("labor-day")

var laborThres = document.getElementById("labor-thres")

var nationYear = document.getElementById("nation-year")
var nationMonth = document.getElementById("nation-month")
var nationDay = document.getElementById("nation-day")

var cal_year_butt = document.getElementById("cal-years")
var yearResult = document.getElementById("year-result")


var labor_year_total = 0.0
var nation_year_total = 0.0

const LABOR_THRES = laborThres.valueAsNumber

cal_year_butt.addEventListener("click",calcu_years)

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
    const month_total_print = (month_total).toFixed(3)
    print_str = print_str + ` ---> ${year}年 ${month_total_print}月`
    
    month_total = month_total/ 12.0
    var year_total = year + month_total
    const year_total_print = (year_total).toFixed(3)
    print_str = print_str + ` ---> ${year_total_print}年`

    var return_obj = {
        result_str: print_str,
        year_total: year_total
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
    var determine_str = "<br>"
    if (labor_year_total >= LABOR_THRES){
        determine_str = determine_str + `勞保年資單獨超過${LABOR_THRES}年，可以勞保老年給付月領`
    }
    else {
        // labor years below threshold
        determine_str = determine_str + `勞保年資單過短，`

        if (year_total >= LABOR_THRES){
            determine_str = determine_str + `然而與國民年金合併超過${LABOR_THRES}年，仍可勞保老年給付月領`
        }
        else{
            determine_str = determine_str + `與國民年金合併仍低於${LABOR_THRES}年，勞保無法月領，只能勞保一次金`
        }
    }

    yearResult.innerHTML = yearResult.innerHTML + determine_str
}