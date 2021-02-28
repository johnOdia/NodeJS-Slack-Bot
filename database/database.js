const User = require('./models/user')

//Save user selection
async function saveToDataBase(id,selection){
    const user = new User({
        id: id,
        selection: selection
    })

    const checkIfUserExists = await User.findOne({id: id}) 
    

    if(!checkIfUserExists){        
        try {
            const newUser = await user.save()
            
            return newUser
        } catch (error) {
            return error
        }
    }

    updateUserSelection(id,selection)
}

async function getTime(user){
    try {
        const savedTime = await User.find(
            { id: user}
        )
        if (savedTime[0].id) return savedTime[0].selection

        else return undefined

    } catch (error) {
        return error.message
    }    
}

async function updateUserSelection(id,newSelection){    
    try {
        await User.findOneAndUpdate(id, {selection: newSelection}, {new: true})

        return "succesfully updated!"
    } catch (error) {
        return error.message
    }
}

module.exports = {
    saveToDataBase: saveToDataBase,
    getTime: getTime
}