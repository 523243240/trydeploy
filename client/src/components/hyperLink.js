
export default function hyperLink(str){

    //check if str contain [  
    let temp = str.indexOf("[");
    //store str before hyper link 
    let content = '';
    //store hyperLink 
    let hyperLink = '';
    //store string that needs to return 
    let total = '';
    
    if(temp < 0){
        //doesn't contain [ return the str back 
        return str; 
    }   
    //this string at least contain [
    temp = str.split("["); 
    for(let i = 0; i < temp.length; i++){
        let temp2;
        if(i === 0){ //Ignore the string before the first '['
            total += temp[0];
            temp2=temp[i+1]
            i += 1; 
        }
        else{
            temp2=temp[i]
        }
        //check if ] exist 
        if(temp2.indexOf(']')===0 &&temp2.indexOf("(") === temp2.indexOf("]")+1 && temp2.indexOf(')') > temp2.indexOf("("))
            
            //] in index 0 means this string contain format like [] and it follow by(), return empty str for warning 
            return ''; 
        else if(temp2.indexOf(']')<=0 ){
            //no ']' after the '[' or just '[]' with no parenthesis(both '(' and ')') directly after, so we skip this match
            total += "[" + temp[i];
            
            continue; //Go to next '['
        } 
        else
        //index greater than 0, check for() and if link starts with http:
            content = temp2.slice(0, temp2.indexOf("]")) 
        
        //next index of ] is ( and the other ) exist check link
        if(temp2.indexOf("(") === temp2.indexOf("]")+1 && temp2.indexOf(')') > temp2.indexOf("(")){
            hyperLink = temp2.slice(temp2.indexOf("(")+1, temp2.indexOf(")")) 
            //if link contains https:// or http:// it' a valid hyper link put them together 
            if(hyperLink.toLowerCase().includes("https://") || hyperLink.toLowerCase().includes("http://")){

                content = `<a href="${hyperLink}" target="_blank">`+content + "</a>" ;
                total += content + temp2.slice(temp2.indexOf(")")+1);
            }
            //[]follow by () but don't have http:// return empty string for warning 
            else{
                return ""
            }
        }
        else{
            //contain [] but ()is not follow by by it or doesn't have (), not a hyperLink, skip this match.
            total += "[" + temp[i];
        }

    }

    return total; 
    

}