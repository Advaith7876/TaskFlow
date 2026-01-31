// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDSyxMeHgfx_-gvjKSSd10RmmiegOTxSs",
    authDomain: "taskflow-86cc3.firebaseapp.com",
    projectId: "taskflow-86cc3",
    storageBucket: "taskflow-86cc3.firebasestorage.app",
    messagingSenderId: "992238578549",
    appId: "1:992238578549:web:a7daee4c6ed4eea0ca413c",
    measurementId: "G-0PM1PF048M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global State
let currentUser = null;
let tasks = [];
let currentFilter = 'all';

// DOM Elements - App
const appContainer = document.getElementById('appContainer');
const loginOverlay = document.getElementById('loginOverlay');
const taskListEl = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const dateDisplay = document.getElementById('currentDate');

// DOM Elements - Auth
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailLoginBtn = document.getElementById('emailLoginBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// DOM Elements - Stats
const totalTasksEl = document.getElementById('totalTasks');
const activeTasksEl = document.getElementById('activeTasks');
const completedTasksEl = document.getElementById('completedTasks');
const progressValueEl = document.getElementById('progressValue');
const badgeAll = document.getElementById('badgeAll');
const badgeActive = document.getElementById('badgeActive');
const badgeCompleted = document.getElementById('badgeCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDate();

    // Auth Listener
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (user) {
            // Show App
            loginOverlay.style.display = 'none';
            appContainer.style.display = 'block';
            updateProfileUI(user);
            subscribeToTasks(user.uid);
        } else {
            // Show Login
            loginOverlay.style.display = 'flex';
            appContainer.style.display = 'none';
            tasks = [];
            renderTasks();
        }
    });
});

function updateProfileUI(user) {
    if (user.photoURL) {
        userAvatar.src = user.photoURL;
    } else {
        // Fallback Avatar
        userAvatar.src = `https://ui-avatars.com/api/?name=${user.email.split('@')[0]}&background=10b981&color=fff`;
    }
    userName.textContent = user.displayName || user.email.split('@')[0];
}

let unsubscribe = null;

function subscribeToTasks(uid) {
    taskListEl.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading tasks...</div>';

    // Unsubscribe from previous listener if exists
    if (unsubscribe) unsubscribe();

    // Query: User's tasks, ordered by creation (assuming we add created timestamp)
    // Note: Creating a composite index might be needed for where() + orderBy()
    // For now, let's just query by uid and sort client side if needed, or rely on addedAt
    const q = query(collection(db, "tasks"), where("uid", "==", uid));

    unsubscribe = onSnapshot(q, (snapshot) => {
        tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        // Client-side sort by ID (timestamp) descending
        tasks.sort((a, b) => b.createdAt - a.createdAt);

        renderTasks();
        updateStats();
    });
}

// Auth Actions
googleLoginBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    googleLoginBtn.innerHTML = 'Signing in...';
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        alert(error.message);
    } finally {
        googleLoginBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google"> Sign in with Google';
    }
});

emailLoginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const pass = passwordInput.value;

    if (!email || !pass) {
        alert('Please enter email and password');
        return;
    }

    if (!email.includes('@')) {
        alert("Invalid email: Must contain '@'");
        return;
    }

    emailLoginBtn.textContent = 'Verifying...';
    try {
        // Try Login
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        // If user not found, try Sign Up (Simplified flow for demo)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, email, pass);
            } catch (createError) {
                alert(createError.message);
            }
        } else {
            alert(error.message);
        }
    } finally {
        emailLoginBtn.textContent = 'Sign In / Sign Up';
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});


// Task Actions
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

async function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;

    if (text === '' || !currentUser) return;

    taskInput.value = '';

    try {
        await addDoc(collection(db, "tasks"), {
            text: text,
            category: category,
            completed: false,
            uid: currentUser.uid,
            createdAt: Date.now()
        });
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("Error saving task: " + e.message);
    }
}

// Global functions for events
window.toggleTask = async function (id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        // Optimistic UI update could go here
        await updateDoc(doc(db, "tasks", id), {
            completed: !task.completed
        });
    }
};

window.deleteTask = async function (id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await deleteDoc(doc(db, "tasks", id));
    }
};

function renderTasks() {
    taskListEl.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskListEl.innerHTML = '<div class="empty-state" style="text-align: center; padding: 2rem; color: var(--text-muted);">No tasks found.</div>';
    } else {
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            const categoryClass = `cat-${task.category.toLowerCase()}`;

            taskItem.innerHTML = `
                <div class="task-left">
                    <div class="task-checkbox" onclick="toggleTask('${task.id}')">
                        ${task.completed ? '<i class="ri-check-line"></i>' : ''}
                    </div>
                    <span class="task-text">${task.text}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span class="task-category ${categoryClass}">
                        <i class="ri-${getCategoryIcon(task.category)}"></i> ${task.category}
                    </span>
                    <button class="delete-btn" onclick="deleteTask('${task.id}')">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;

            taskListEl.appendChild(taskItem);
        });
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case 'Work': return 'briefcase-line';
        case 'Personal': return 'user-smile-line';
        case 'Shopping': return 'shopping-bag-3-line';
        case 'Health': return 'heart-pulse-line';
        default: return 'bookmark-line';
    }
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalTasksEl.innerText = total;
    activeTasksEl.innerText = active;
    completedTasksEl.innerText = completed;

    badgeAll.innerText = total;
    badgeActive.innerText = active;
    badgeCompleted.innerText = completed;

    progressValueEl.innerText = progress;

    const progressCard = document.querySelector('.progress-circle');
    if (progressCard) {
        progressCard.style.setProperty('--percentage', progress);
    }
}
