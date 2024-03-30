import { AuthPage } from "@refinedev/antd";
import { authCredentials } from "../../providers/auth";

export const Login = () => {
    return (
        <AuthPage
            type="login"
            formProps={{
                // /data/index,ts
                initialValues: authCredentials,
            }}
        />
    );
};
