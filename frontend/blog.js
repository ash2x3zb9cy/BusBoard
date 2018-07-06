
window.onload = () => {

	const form = document.getElementById("newPostForm");
	form.addEventListener('submit', e => {

		const posts = document.getElementById('posts');

		const newPostTitle = document.getElementById('postTitle');
		const newPostBody = document.getElementById('postBody');
		const timeStamp = new Date();
		posts.innerHTML +=
			`<li>
				<h2>${newPostTitle.value}</h2>
				<h4>${timeStamp}</h4>
				${newPostBody.value}
			</li>`;

		e.preventDefault();
	});

}

