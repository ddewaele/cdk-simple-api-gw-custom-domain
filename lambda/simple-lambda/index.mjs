export const handler = async (event) => {
    console.log("Event = " + JSON.stringify(event));    
    return {
        body: JSON.stringify({ "message": "Hello from Lambda!" }),
        statusCode:200
    }
}
