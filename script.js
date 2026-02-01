//event Listener for search button
document.getElementById("search-btn").addEventListener("click", () => {
  const username = document.getElementById("search").value.trim();
  if (username) {
    fetchGitHubUser(username);
  }
});
//event Listener for pressing Enter
// Also search when pressing Enter
document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("search-btn").click();
  }
});
//Fetch Github User Function
async function fetchGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      showError();
      return;
    }
//Function to convert API response to JavaScript object
    const user = await response.json();
    displayProfile(user);

    // Fetch repositories
    const repoResponse = await fetch(user.repos_url + "?sort=created&per_page=5");
    const repos = await repoResponse.json();
    displayRepos(repos);
  } catch (error) {
    showError();
  }
}

function displayProfile(user) {
  document.getElementById("error-container").classList.add("hidden");
  document.getElementById("profile-container").classList.remove("hidden");

  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || "No name available";
  document.getElementById("username").textContent = `@${user.login}`;
  document.getElementById("bio").textContent = user.bio || "No bio available";
  document.getElementById("profile-link").href = user.html_url;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;
  document.getElementById("repos").textContent = user.public_repos;
  document.getElementById("location").textContent = user.location || "Not specified";
  document.getElementById("joined-date").textContent = new Date(user.created_at).toDateString();
}

function displayRepos(repos) {
  const container = document.getElementById("repos-container");
  container.innerHTML = "";
  repos.forEach(repo => {
    const div = document.createElement("div");
    div.classList.add("repo-card");
    div.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      <p>${repo.description || "No description"}</p>
    `;
    container.appendChild(div);
  });
}

function showError() {
  document.getElementById("profile-container").classList.add("hidden");
  document.getElementById("error-container").classList.remove("hidden");
}
