import { Outlet, NavLink, Link } from "react-router-dom";

export default function Layout() {
	return (
		<div>
			<nav>
				<Link to="/">Home</Link>
				<ul>
					<section>
						<li>
							<NavLink to="/login">Login</NavLink>
						</li>
						<li>
							<NavLink to="/register">Register</NavLink>
						</li>
						<li>
							<NavLink to="/logout">Logout</NavLink>
						</li>
					</section>
					<li>
						<NavLink to="/profile/edit">Edit Profile</NavLink>
					</li>
					<li>
						<NavLink to="/dashboard">Dashboard</NavLink>
					</li>
					<li>
						<NavLink to="/cookbook">Cookbook</NavLink>
					</li>
					<li>
						<NavLink to="/recipe/new">New Recipe</NavLink>
					</li>
				</ul>
			</nav>
			<Outlet />
		</div>
	);
}
