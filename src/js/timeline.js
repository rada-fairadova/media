export class Timeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.posts = [];
    }

    addPost(content, coordinates, type = 'text') {
        const post = {
            id: Date.now(),
            content,
            coordinates,
            type,
            timestamp: new Date()
        };

        this.posts.unshift(post); 
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        
        this.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.container.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        
        const dateString = post.timestamp.toLocaleString();
        
        postDiv.innerHTML = `
            <div class="post-header">
                <span class="post-type">${post.type.toUpperCase()}</span>
                <span class="post-date">${dateString}</span>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-coordinates">
                Coordinates: ${post.coordinates.latitude.toFixed(5)}, ${post.coordinates.longitude.toFixed(5)}
            </div>
        `;

        return postDiv;
    }
}