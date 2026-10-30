"use strict";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_LIMIT = 5;

const form = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const createButton = document.getElementById("create-btn");
const loadButton = document.getElementById("load-btn");
const postsList = document.getElementById("posts");
const message = document.getElementById("message");

const showMessage = (text, type) => {
  message.textContent = text;
  message.className = type;
};

const getErrorText = (error) =>
  error instanceof TypeError ? "нет соединения с сервером" : error.message;

const createPostItem = ({ id, title, body }) => {
  const item = document.createElement("li");
  const heading = document.createElement("h3");
  const text = document.createElement("p");
  const label = document.createElement("span");
  heading.textContent = title;
  text.textContent = body;
  label.className = "post-id";
  label.textContent = `ID: ${id}`;
  item.append(heading, text, label);
  return item;
};

const loadPosts = async () => {
  loadButton.disabled = true;
  showMessage("Загрузка публикаций...", "info");
  try {
    const response = await fetch(`${POSTS_URL}?_limit=${POSTS_LIMIT}`);
    if (!response.ok) {
      throw new Error(`сервер вернул ошибку ${response.status}`);
    }
    const posts = await response.json();
    postsList.replaceChildren(...posts.map(createPostItem));
    showMessage(`Загружено публикаций: ${posts.length}`, "success");
  } catch (error) {
    showMessage(
      `Не удалось загрузить публикации: ${getErrorText(error)}`,
      "error",
    );
  } finally {
    loadButton.disabled = false;
  }
};

const createPost = async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (title === "" || body === "") {
    showMessage("Заполните заголовок и текст публикации", "error");
    (title === "" ? titleInput : bodyInput).focus();
    return;
  }
  createButton.disabled = true;
  showMessage("Отправка публикации...", "info");
  try {
    const response = await fetch(POSTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    if (!response.ok) {
      throw new Error(`сервер вернул ошибку ${response.status}`);
    }
    const created = await response.json();
    postsList.prepend(createPostItem(created));
    form.reset();
    showMessage(
      `Публикация «${created.title}» создана, ID: ${created.id}`,
      "success",
    );
  } catch (error) {
    showMessage(
      `Не удалось создать публикацию: ${getErrorText(error)}`,
      "error",
    );
  } finally {
    createButton.disabled = false;
  }
};

loadButton.addEventListener("click", loadPosts);
form.addEventListener("submit", createPost);
