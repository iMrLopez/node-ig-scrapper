const Axios = require('axios').default;

async function instagramPhotos (username) {
    // It will contain our photos' links
    const photos = []
    let userInfo = null;
    try {
        const userInfoSource = await Axios.get('https://www.instagram.com/' + username + '/')

        // userInfoSource.data contains the HTML from Axios
        const jsonObject = userInfoSource.data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1)

        userInfo = JSON.parse(jsonObject)
        // Retrieve the user photos
        const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
        for (let media of mediaArray) {
            const node = media.node
            
            // Process only if is an image
            if ((node.__typename && node.__typename !== 'GraphImage')) {
                continue
            }

            // Push the thumbnail src in the array
            photos.push(node.thumbnail_src)
        }
    } catch (e) {
        console.error('Unable to retrieve info. Reason: ' + e.toString())
    }
    
    return {userInfo: userInfo.entry_data.ProfilePage[0].graphql.user, userPhotos: photos};
}
instagramPhotos('i_mrlopez').then(res => {
   console.log(res)
})