namespace :utils do
  desc "Popular banco de dados."
  task seed: :environment do
      100.times do |i|
          puts "Gerando os contatos (Contacts) ..."
          contato = Contact.create!(
              name: Faker::HarryPotter.character,
              email: Faker::Internet.unique.safe_email,
              kind: Kind.all.sample,
              rmk: Faker::HarryPotter.quote
              )

          puts "Gerando os contatos (Contacts) ...[OK]"

          puts "Gerando os endereços (Addresses) ..."
          Address.create!(
              street: Faker::Address.street_name,
              city: Faker::Address.city,
              state: Faker::Address.state_abbr,
              contact: contato
          )

          puts "Gerando os endereços (Addresses) ...[OK]"


          puts "Gerando os telefones (Phones) ..."
          Random.rand(1..5).times do |x|
            Phone.create!(
              phone: Faker::PhoneNumber.phone_number,
              contact: contato
            )
          end

          puts "Gerando os telefones (Phones) ...[OK]"
    end
  end
end
