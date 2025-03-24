export default{
    template : `
    <div class="row boader">
        <div class="col">
            <div class="boarder">
                {{userData.email}}
                {{userData.token}}
            </div>
        </div>
    </div>    `
    ,
    data: function(){
        return {
            userData:""
        }
    },
    mounted() {
        fetch('/api/home',{
            method: 'GET',
            headers : {
                "Content-Type" : 'application/json',
                "Authentication-Token": localStorage.getItem('auth_token')
            }
        })  
        .then(response => response.json())
        .then(data => {
          this.userData = data
        })
}
}
