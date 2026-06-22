from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.conf import settings
import pymysql
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os

def get_db_connection():
    """Reusable MySQL connection (always returns DictCursor)"""
    return pymysql.connect(
    host=os.environ.get("MYSQLHOST", "127.0.0.1"),
    port=int(os.environ.get("MYSQLPORT", 3306)),
    user=os.environ.get("MYSQLUSER", "root"),
    password=os.environ.get("MYSQLPASSWORD", "root"),
    database=os.environ.get("MYSQLDATABASE", "webdb6"),
    cursorclass=pymysql.cursors.DictCursor
)

def ensure_single_admin():
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()

            cur.execute("SELECT id FROM users_table WHERE role='admin'")
            admin = cur.fetchone()

            if not admin:
                cur.execute("""
                    INSERT INTO users_table
                    (username, email, password, mobile, address, role, approved)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    "admin",
                    "admin@gmail.com",
                    "admin",
                    "1234567890",
                    "Hyderabad",
                    "admin",
                    1
                ))
                con.commit()

    except Exception as e:
        print("Admin Error:", e)




@api_view(["GET"])
def user_details_api(request):
    username = request.GET.get("username")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)
            cur.execute("SELECT * FROM users_table WHERE username=%s", (username,))
            user = cur.fetchone()

        return Response({"user": user})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def user_page_api(request):
    username = request.GET.get("username")

    if not username:
        return Response({"error": "Username required"})

    return Response({"success": "User page loaded", "username": username})



@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()
            cur.execute("UPDATE users_table SET approved = 1 WHERE username = %s", (username,))
            con.commit()

        return Response({"success": "User approved"})

    except Exception as e:
        return Response({"error": str(e)})



@api_view(["GET"])
def admin_page_api(request):
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)
            cur.execute("SELECT * FROM users_table WHERE role='user'")
            users_list = cur.fetchall()

        return Response({"users": users_list})

    except Exception as e:
        return Response({"error": str(e)})




from rest_framework.response import Response
from rest_framework.decorators import api_view
import pymysql

@api_view(["POST"])
def register_api(request):
   

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm = request.data.get("confirm_password")
    mobile = request.data.get("mobile")
    address = request.data.get("address")
    role = "user"

    if password != confirm:
        return Response({"error": "Passwords do not match"})

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()

            cur.execute("SELECT username FROM users_table WHERE username=%s", (username,))
            if cur.fetchone():
                return Response({"error": "Username already exists"})

            cur.execute("SELECT email FROM users_table WHERE email=%s", (email,))
            if cur.fetchone():
                return Response({"error": "Email already exists"})

            cur.execute("SELECT mobile FROM users_table WHERE mobile=%s", (mobile,))
            if cur.fetchone():
                return Response({"error": "Mobile already exists"})

            cur.execute("""
                INSERT INTO users_table 
                (username, email, password, role, approved, mobile, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (username, email, password, role, 0, mobile, address))

            con.commit()
            return Response({"success": "Account created. Awaiting Admin approval"})

    except Exception as e:
        return Response({"error": "Database error: " + str(e)})


@api_view(["POST"])
def login_api(request):
    ensure_single_admin()
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)
            cur.execute(
                "SELECT * FROM users_table WHERE username=%s AND password=%s",
                (username, password)
            )
            user = cur.fetchone()

            if not user:
                return Response({"error": "Invalid login credentials"})

            if user['approved'] == 0:
                return Response({"error": "Account not approved yet"})

            return Response({
                "success": "Login successful",
                "username": user['username'],
                "role": user['role']
            })

    except Exception as e:
        return Response({"error": "Database error: " + str(e)})



@api_view(["POST"])
def add_donation_center_api(request):
    center_name = request.data.get("center_name")
    location = request.data.get("location")
    contact = request.data.get("contact")
    timings = request.data.get("timings")
    categories = request.data.get("categories")
    donation_type = request.data.get("donation_type")

    if not all([center_name, location, contact, timings, categories, donation_type]):
        return Response({"error": "All fields are required"})

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()
            cur.execute("""
                INSERT INTO donation_centers
                (center_name, location, contact, timings, categories, donation_type)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                center_name,
                location,
                contact,
                timings,
                categories,
                donation_type
            ))
            con.commit()

        return Response({"success": "Donation center added successfully"})

    except Exception as e:
        return Response({"error": str(e)})



@api_view(["GET"])
def admin_centers_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM donation_centers")
        centers = cur.fetchall()

    return Response({"centers": centers})



@api_view(["POST"])
def update_center_timing_api(request):
    center_id = request.data.get("id")
    timings = request.data.get("timings")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "UPDATE donation_centers SET timings=%s WHERE id=%s",
            (timings, center_id),
        )
        con.commit()

    return Response({"success": "Center timing updated"})



@api_view(["POST"])
def toggle_center_status_api(request):
    center_id = request.data.get("id")
    status = request.data.get("status")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "UPDATE donation_centers SET status=%s WHERE id=%s",
            (status, center_id),
        )
        con.commit()

    return Response({"success": "Center status updated"})


@api_view(["GET"])
def admin_categories_api(request):
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()
            cur.execute("SELECT * FROM medicine_categories")
            categories = cur.fetchall()
        return Response({"categories": categories})
    except Exception as e:
        return Response({"error": str(e)})



@api_view(["POST"])
def delete_category_api(request):
    cat_id = request.data.get("id")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()
            cur.execute(
                "DELETE FROM medicine_categories WHERE id=%s",
                (cat_id,)
            )
            con.commit()
        return Response({"success": "Medicine category removed"})
    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def centers_by_type_api(request):
    donation_type = request.GET.get("type")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute(
            "SELECT * FROM donation_centers WHERE donation_type=%s AND status='active'",
            (donation_type,)
        )
        centers = cur.fetchall()

    return Response({"centers": centers})
