import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

def test_api():
    print("🧪 Testing LinkedIn Clone API")
    print("=" * 40)
    
    # Test 1: Register a new user
    print("\n1. Testing User Registration...")
    import random
    email_suffix = random.randint(1000, 9999)
    register_data = {
        "name": "Test User",
        "email": f"test{email_suffix}@example.com",
        "password": "password123",
        "bio": "This is a test user account"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 201:
            print("✅ User registration successful")
            user_data = response.json()
            token = user_data['token']
            user_id = user_data['user']['id']
            print(f"   User ID: {user_id}")
        else:
            print(f"❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # Test 2: Login with the same user
    print("\n2. Testing User Login...")
    login_data = {
        "email": f"test{email_suffix}@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            print("✅ User login successful")
            login_response = response.json()
            token = login_response['token']
        else:
            print(f"❌ Login failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test 3: Create a post
    print("\n3. Testing Post Creation...")
    headers = {"Authorization": f"Bearer {token}"}
    post_data = {
        "content": "This is my first post on this LinkedIn clone! 🎉"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/posts", json=post_data, headers=headers)
        if response.status_code == 201:
            print("✅ Post creation successful")
            post = response.json()
            post_id = post['id']
            print(f"   Post ID: {post_id}")
        else:
            print(f"❌ Post creation failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Post creation error: {e}")
        return
    
    # Test 4: Get all posts
    print("\n4. Testing Get All Posts...")
    try:
        response = requests.get(f"{BASE_URL}/posts")
        if response.status_code == 200:
            posts = response.json()
            print(f"✅ Retrieved {len(posts)} posts")
            if posts:
                print(f"   Latest post: {posts[0]['content'][:50]}...")
        else:
            print(f"❌ Get posts failed: {response.text}")
    except Exception as e:
        print(f"❌ Get posts error: {e}")
    
    # Test 5: Get user profile
    print("\n5. Testing Get User Profile...")
    try:
        response = requests.get(f"{BASE_URL}/users/{user_id}")
        if response.status_code == 200:
            user = response.json()
            print("✅ User profile retrieved successfully")
            print(f"   Name: {user['name']}")
            print(f"   Email: {user['email']}")
        else:
            print(f"❌ Get user profile failed: {response.text}")
    except Exception as e:
        print(f"❌ Get user profile error: {e}")
    
    # Test 6: Get user's posts
    print("\n6. Testing Get User Posts...")
    try:
        response = requests.get(f"{BASE_URL}/posts/user/{user_id}")
        if response.status_code == 200:
            user_posts = response.json()
            print(f"✅ Retrieved {len(user_posts)} posts for user")
        else:
            print(f"❌ Get user posts failed: {response.text}")
    except Exception as e:
        print(f"❌ Get user posts error: {e}")
    
    print("\n🎉 API Testing Complete!")
    print("=" * 40)

if __name__ == "__main__":
    test_api()
