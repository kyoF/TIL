fn main() {
    let mut x = 3;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);

    let y = 5;
    let y = y + 1;
    {
        let y = y * 2;
        println!("The value of x is: {}", y);
    }

    println!("The value of y is: {}");
}
