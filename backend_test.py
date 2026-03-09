import requests
import sys
import json
from datetime import datetime

class UserManagementAPITester:
    def __init__(self, base_url="https://global-backdrop-sync.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.created_user_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"\n🔍 {name}: {status}")
        if details:
            print(f"   {details}")
        if success:
            self.tests_passed += 1

    def run_test(self, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if headers:
            default_headers.update(headers)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            
            success = response.status_code == expected_status
            return success, response
        except Exception as e:
            print(f"   Error: {str(e)}")
            return False, None

    def test_user_registration(self):
        """Test POST /api/auth/register"""
        timestamp = datetime.now().strftime("%H%M%S")
        test_user = {
            "username": f"testuser_{timestamp}",
            "email": f"test_{timestamp}@example.com",
            "password": "TestPass123!",
            "company": "Test Construction Co",
            "role": "contractor",
            "expertise_level": "intermediate",
            "country": "US",
            "years_experience": 5,
            "specializations": ["Electrical", "Plumbing"],
            "project_types": ["Residential", "Commercial"],
            "bio": "Experienced contractor specializing in electrical and plumbing work.",
            "consent_data_sharing": True
        }
        
        # Check both 200 and 201 as acceptable success codes
        url = f"{self.base_url}/api/auth/register"
        headers = {'Content-Type': 'application/json'}
        
        try:
            response = requests.post(url, json=test_user, headers=headers)
            print(f"   Registration response status: {response.status_code}")
            print(f"   Registration response body: {response.text[:200]}...")
            
            if response.status_code in [200, 201]:
                try:
                    data = response.json()
                    if 'access_token' in data and 'user' in data:
                        self.token = data['access_token']
                        self.created_user_id = data['user']['id']
                        self.log_test("User Registration", True, f"User created with ID: {self.created_user_id}")
                        return True
                    else:
                        self.log_test("User Registration", False, "Missing token or user in response")
                        return False
                except json.JSONDecodeError:
                    self.log_test("User Registration", False, "Invalid JSON response")
                    return False
            else:
                error_msg = f"Status: {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg = error_data.get('detail', error_msg)
                except:
                    pass
                self.log_test("User Registration", False, error_msg)
                return False
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False

    def test_user_login(self):
        """Test POST /api/auth/login with created user"""
        if not self.token:
            self.log_test("User Login", False, "No user created to test login")
            return False
        
        # Try login with wrong credentials first
        wrong_creds = {
            "email": "wrong@example.com",
            "password": "wrongpass"
        }
        
        success, response = self.run_test('POST', 'auth/login', 401, wrong_creds)
        if success:
            self.log_test("User Login (Wrong Credentials)", True, "Correctly rejected invalid credentials")
        else:
            self.log_test("User Login (Wrong Credentials)", False, "Should have returned 401 for wrong credentials")
        
        # Now test with correct credentials (we need to extract email from token or use the one we registered with)
        timestamp = datetime.now().strftime("%H%M%S") 
        correct_creds = {
            "email": f"test_{timestamp}@example.com",  # This should match the email from registration
            "password": "TestPass123!"
        }
        
        success, response = self.run_test('POST', 'auth/login', 200, correct_creds)
        if success and response:
            try:
                data = response.json()
                if 'access_token' in data:
                    self.log_test("User Login (Correct Credentials)", True, "Successfully logged in")
                    return True
            except:
                pass
        
        self.log_test("User Login (Correct Credentials)", False, "Login failed with correct credentials")
        return False

    def test_get_current_user(self):
        """Test GET /api/auth/me"""
        if not self.token:
            self.log_test("Get Current User", False, "No authentication token available")
            return False
        
        headers = {'Authorization': f'Bearer {self.token}'}
        success, response = self.run_test('GET', 'auth/me', 200, headers=headers)
        
        if success and response:
            try:
                user_data = response.json()
                if 'id' in user_data and 'username' in user_data and 'email' in user_data:
                    self.log_test("Get Current User", True, f"Retrieved user: {user_data.get('username')}")
                    return True
            except:
                pass
        
        self.log_test("Get Current User", False, "Failed to retrieve current user")
        return False

    def test_list_users(self):
        """Test GET /api/users"""
        success, response = self.run_test('GET', 'users', 200)
        
        if success and response:
            try:
                data = response.json()
                if 'users' in data and 'total' in data and 'page' in data:
                    user_count = len(data['users'])
                    total = data['total']
                    self.log_test("List Users", True, f"Retrieved {user_count} users, total: {total}")
                    return True
            except:
                pass
        
        self.log_test("List Users", False, "Failed to retrieve users list")
        return False

    def test_filter_users_by_role(self):
        """Test GET /api/users?role=contractor"""
        success, response = self.run_test('GET', 'users?role=contractor', 200)
        
        if success and response:
            try:
                data = response.json()
                if 'users' in data:
                    contractors = data['users']
                    # Verify all returned users have contractor role
                    all_contractors = all(user.get('role') == 'contractor' for user in contractors)
                    if all_contractors:
                        self.log_test("Filter Users by Role", True, f"Found {len(contractors)} contractors")
                        return True
                    else:
                        self.log_test("Filter Users by Role", False, "Some returned users are not contractors")
                        return False
            except:
                pass
        
        self.log_test("Filter Users by Role", False, "Failed to filter users by role")
        return False

    def test_pagination(self):
        """Test pagination with per_page parameter"""
        success, response = self.run_test('GET', 'users?page=1&per_page=5', 200)
        
        if success and response:
            try:
                data = response.json()
                if 'users' in data and 'page' in data and 'per_page' in data:
                    users = data['users']
                    page = data['page']
                    per_page = data['per_page']
                    
                    if len(users) <= per_page and page == 1:
                        self.log_test("Pagination", True, f"Page {page} with {len(users)}/{per_page} users")
                        return True
            except:
                pass
        
        self.log_test("Pagination", False, "Pagination not working correctly")
        return False

    def test_search_functionality(self):
        """Test search functionality"""
        success, response = self.run_test('GET', 'users?search=test', 200)
        
        if success and response:
            try:
                data = response.json()
                if 'users' in data:
                    search_results = data['users']
                    self.log_test("Search Functionality", True, f"Search returned {len(search_results)} results")
                    return True
            except:
                pass
        
        self.log_test("Search Functionality", False, "Search functionality failed")
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting User Management API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Test registration first (creates user and gets token)
        if not self.test_user_registration():
            print("\n❌ Registration failed - cannot continue with other tests")
            return False
        
        # Test login
        self.test_user_login()
        
        # Test authenticated endpoint
        self.test_get_current_user()
        
        # Test public endpoints
        self.test_list_users()
        self.test_filter_users_by_role()
        self.test_pagination()
        self.test_search_functionality()
        
        # Print final results
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = UserManagementAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())