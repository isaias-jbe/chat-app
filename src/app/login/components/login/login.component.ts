import { takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorService } from 'src/app/core/services/error.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  configs = {
    isLogin: true,
    actionText: 'SignIn',
    buttonActionText: 'Create account',
    isloading: false
  };
  private nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  private alive = true;

  @HostBinding('class.app-login-spinner') private applySpinnerClass = true;

  constructor(
    public authService: AuthService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private router: Router,
    private matSnakBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createForm();
    const userData = this.authService.getRememberMe();
    if (userData) {
      this.email.setValue(userData.email);
      this.password.setValue(userData.password);
    }
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    this.configs.isloading = true;

    const operation = this.configs.isLogin
      ? this.authService.signinUser(this.loginForm.value)
      : this.authService.signupUser(this.loginForm.value);

    operation.pipe(takeWhile(() => this.alive)).subscribe(
      res => {
        // Chama o metodo que grava o email/password no localStorage
        this.authService.setRememberMe(this.loginForm.value);

        const redirect: string = this.authService.redirectUrl || '/dashboard';
        // redirect with router
        console.log('redirecting...', redirect);
        this.router.navigate([redirect]);
        this.authService.redirectUrl = null;
        this.configs.isloading = false;
      },
      error => {
        console.log(error);
        this.configs.isloading = false;
        this.matSnakBar.open(this.errorService.getErrorMessage(error), 'Done', {
          duration: 5000,
          verticalPosition: 'top'
        });
      },
      () => console.log('Observable completado!')
    );
  }

  changeAction(): void {
    this.configs.isLogin = !this.configs.isLogin;
    this.configs.actionText = !this.configs.isLogin ? 'SignUp' : 'SignIn';
    this.configs.buttonActionText = !this.configs.isLogin
      ? 'Already have account'
      : 'Create account';
    !this.configs.isLogin
      ? this.loginForm.addControl('name', this.nameControl)
      : this.loginForm.removeControl('name');
  }

  get name(): FormControl {
    return this.loginForm.get('name') as FormControl;
  }
  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  /**
   * Chama o metodo "toggleKeepSigned()" que manipula a variável que define se
   * o usuário quer permanecer logado.
   * Não recebe parametros e não retorna nada
   */
  onKeepSigned(): void {
    this.authService.toggleKeepSigned();
  }

  /**
   * Aciona o metodo "toggleRememberMe()", responssável por setar a chave
   * "agc-remember-me". Esta chave informa se o usuário optou por grava os
   * dados de login (email/password) no localStorage
   */
  onRememberMe(): void {
    this.authService.toggleRememberMe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
